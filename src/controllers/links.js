const { LinkSchema } = require('../db/links')
const { GroupSchema } = require('../db/groups')
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const { response } = require('express')

module.exports.index = async (req, res) => {
  const links = await LinkSchema.find().populate(['user', 'group'])
  await Promise.all(links.map(async link => {
    await fetch(link.url)
      .then(res => res.text())
      .then(data => {
        const $ = cheerio.load(data)
        const title = $('meta[property="og:title"]').attr('content') || $('title').text() || $('meta[name="title"]').attr('content')
        const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content')
        const url = $('meta[property="og:url"]').attr('content')
        const site_name = $('meta[property="og:site_name"]').attr('content')
        const image = $('meta[property="og:image"]').attr('content') || $('meta[property="og:image:url"]').attr('content')
        link.link_data = { title: title, description: description, url: url, site_name: site_name, image: image }
      })
      .catch(rej => {
        console.log(rej)
        link.link_data = {}
      })
  }))
  res.render('links/index', { linkItems: links })
}

module.exports.renderNewForm = async (req, res) => {
  const userGroups = req.user.groups
  const groups = await GroupSchema.find({ _id: { $in: userGroups } }).populate('members')
  res.render('links/new.ejs', { groups })
}

module.exports.createLink = async (req, res) => {
  // ensure all links work
  let url = req.body.url

  if (!url.startsWith('https://')) {
    url = 'https://' + url
  }
  // Next: Should re-prompt user to enter link again
  if (!isValidHttpUrl(url)) {
    url = '/links' // take user back to links page if link url is not valid
    req.flash('error', 'You have just added an invalid link') // inform the user of their mistake
  }

  const link = new LinkSchema({
    name: req.body.name,
    notes: req.body.notes,
    url: url,
    user: req.user,
    group: req.body.selectedGroup
  })
  await link.save()
  res.redirect('/links')
}

// should I put this function in it's own file? In utils/linkUtils.js?
function isValidHttpUrl(string) {
  let url

  try {
    url = new URL(string)
  } catch (_) {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}
