const { GroupSchema } = require('../db/groups')
const { StudentProfile } = require('../db/studentProfiles')
// Public

module.exports.index = async (req, res) => {
  const groups = await GroupSchema.find({})
  res.render('groups/index', { groups })
}

module.exports.explore = async (req, res) => {
  const groupId = req.params.id
  // only display people who are not already in the group
  const students = await StudentProfile.find({})
  const group = await GroupSchema.findById(req.params.id)
  res.render('groups/explore', { students: students, group: group })
}

module.exports.renderNewForm = (req, res) => {
  res.render('groups/new')
}

module.exports.createGroup = async (req, res, next) => {
  const group = new GroupSchema({
    name: req.body.name
  })
  // group.members = [req.user._id]
  await group.save()
  // req.flash('success', 'Successfully made a new group!')
  res.redirect('/groups/')
}
module.exports.showGroup = async (req, res) => {
  const group = await GroupSchema.findById(req.params.id)

  if (!group) {
    // req.flash('error', 'Cannot find that group!')
    return res.redirect('/groups')
  }
  res.render('groups/show', { group })
}

module.exports.deleteGroup = async (req, res) => {
  const id = req.params.id
  await GroupSchema.findByIdAndDelete(id)
  res.redirect('/groups')
}

module.exports.deleteGroupMember = async (req, res) => {
  const id = req.params.id
  const member = req.params.member
  await GroupSchema.updateOne({ _id: id },
    { $pull: { members: member } })
  res.redirect('/groups')
}

module.exports.inviteGroupMember = async (req, res) => {
  const groupId = req.params.id
  const memberId = req.params.member
  await GroupSchema.updateOne({ _id: groupId },
    { $push: { invites: memberId } })
  await StudentProfile.updateOne({ _id: memberId },
    { $push: { invites: groupId } })
  res.redirect(`/groups/${groupId}`)
}
