const { StudentProfile } = require('../src/db/studentProfiles')
const { LinkSchema } = require('../src/db/links')
const { Tag } = require('../src/db/tags')
const { GroupSchema } = require('../src/db/groups')
const { MeetingSchema } = require('../src/db/meetings')
const { Poll } = require('../src/db/poll')
const { db } = require('../src/db')
const { getGeoData } = require('./locationHelper')

const studentFirstNames = ['Dave', 'Steve', 'Will', 'Jess', 'Emily', 'Rebecca']
const studentLastNames = ['Stevens', 'Williams', 'Denham', 'Tobias', 'Taylor', 'Bench']
const groupNames = ['Dilly', 'Dally', 'Late', 'Submission', 'Jam', 'Group']
const meetingNames = ['Study', 'Chat', 'Braai', 'Lunch', 'Coffee']
const tags = ['fun', 'electronics', 'math', 'interactive']
const coords = [[23.3645, 34.0575], [28.0473, 26.2041]] // plett, joburg coords

const linkNames = ['Study Notes', 'Study Tips', 'Introduction to Notes', 'Important Link', 'Please Read']
const linkNotes = ['Please read this by Monday', 'Please read this by Tuesday', 'Please read this by Wednesday', 'Please read this by Thursday', 'Please read this by Friday']
const linkUrls = ['https://en.wikipedia.org/wiki/Special:Random', 'https://en.wikipedia.org/wiki/Special:Random', 'https://en.wikipedia.org/wiki/Special:Random', 'https://en.wikipedia.org/wiki/Special:Random', 'https://en.wikipedia.org/wiki/Special:Random']

generateStudents(studentFirstNames, studentLastNames, 10)
  .then(() => generateGroups(groupNames, 5))
  .then(() => generateTags(tags))
  .then(() => generateMeetings(meetingNames))
  .then(() => generateLinks(linkNames, linkNotes, linkUrls, 5))
  .then(() => db.close())
  .catch(err => {
    console.error('Error:', err)
  })

async function generateStudents (firstNames, lastNames, numStudents) {
  // Deletes all the current data in there to start fresh
  await StudentProfile.deleteMany({})
  console.log('Dropped Students Collection 🔮')
  // Deletes all the current data in there to start fresh
  await Poll.deleteMany({})
  console.log('Dropped Poll Collection 🔮')

  // generate a random set of user profile data
  for (let i = 0; i < numStudents; i++) {
    const data = getGeoData()
    const location = data.location
    const geodata = data.geodata
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const newStudent = new StudentProfile({
      email: `${firstName}.${lastName}${i}@test.com`,
      firstName: firstName,
      lastName: lastName,
      password: '',
      groups: [],
      username: `${firstName}${lastName}${i}`,
      invites: [],
      location,
      geodata,
      settings: { isSearchable: true, locationViewable: false }
    })
    await StudentProfile.register(newStudent, 'test')
  }

  // Inserts many students into a mongodb collection
  console.log('Inserted New Students 💎')
}

async function generateGroups (groupNames, numGroups) {
  const people = await StudentProfile.find({}) // finds all profiles in the database

  // Deletes all the current data in there to start fresh
  await GroupSchema.deleteMany({})
  console.log('Dropped Groups Collection 🔮')

  // generate a random set of user group data
  for (let i = 0; i < numGroups; i++) {
    const first = groupNames[Math.floor(Math.random() * groupNames.length)] // creates random group name
    const last = groupNames[Math.floor(Math.random() * groupNames.length)]
    const addedMembers = []
    const addedTags = []
    for (let j = 0; j < 2; j++) { // adding two members and two tags, can be altered later
      const member = people[Math.floor(Math.random() * people.length)]._id // finds random member to add
      addedMembers.push(member)
      const tag = tags[Math.floor(Math.random() * tags.length)] // finds random tag to add
      addedTags.push(tag)
    }

    const newGroup = new GroupSchema({
      name: `${first} ${last} ${i}`,
      members: addedMembers,
      invites: []
    })
    // Inserts a group into a mongodb collection
    const savedGroup = await newGroup.save()
    // Adds group to members profile
    for (const member of addedMembers) {
      await StudentProfile.findByIdAndUpdate(member._id, { $push: { groups: savedGroup._id } })
    }
  }

  console.log('Inserted New Groups 💎')
}
async function generateTags (tags) {
  await Tag.deleteMany({})
  console.log('Dropped Tags Collection 🔮')
  for (const tag of tags) {
    const newTag = new Tag({
      name: tag,
      groups: []
    })
    await newTag.save()
  }
  console.log('Inserted New Tags 💎')
}
async function generateMeetings (meetingNames) {
  // Deletes all the current data in there to start fresh this ensures the collections exists before dropping it, otherwise an error occurs
  await MeetingSchema.deleteMany({})
  await LinkSchema.deleteMany({})
  console.log('Dropped Meetings Collection 🔮')

  const groups = await GroupSchema.find({}) // finds all groups in the database

  // generate a random set of user group data
  let index = 0
  for (const group of groups) {
    const first = meetingNames[Math.floor(Math.random() * meetingNames.length)] // creates random group name
    const last = meetingNames[Math.floor(Math.random() * meetingNames.length)]
    const addedMembers = group.members.toObject() // sets members of meetings to group members
    const coord = coords[Math.floor(Math.random() * coords.length)] // gets random coord

    const HH = Math.floor(Math.random() * 12)
    const yyyy = 2021
    const MM = Math.floor(Math.random() * 12)
    const dd = Math.floor(Math.random() * 28)
    const mm = Math.floor(Math.random() * 60)
    const start = new Date(yyyy, MM, dd, HH, mm, 0)
    const end = new Date(yyyy, MM, dd, HH + 2, mm, 0)
    const newMeeting = new MeetingSchema({
      name: `${first} ${last} ${index}`,
      description: `This is generated by the seeds file! Meeting number: ${index}`,
      group: group._id,
      attendees: addedMembers,
      location: { type: 'Point', cooridinates: coord },
      start: start,
      end: end
    })
    const savedMeeting = await newMeeting.save() // saves meeting
    await GroupSchema.findByIdAndUpdate(group._id, { $push: { meetings: savedMeeting._id } }) // adds meeting to this group
    index++
  }
  console.log('Inserted New Meetings 💎')
}

async function generateLinks (linkNames, linkNotes, linkUrls, numLinks) {
  // Deletes all the current data in there to start fresh
  await LinkSchema.deleteMany({})
  console.log('Dropped Links Collection 🔮')

  const people = await StudentProfile.find({}) // finds all profiles in the database
  const groups = await GroupSchema.find({}) // finds all groups in the database

  const insertLinks = []
  for (let i = 0; i < numLinks; i++) {
    const name = linkNames[Math.floor(Math.random() * linkNames.length)] // creates random group name
    const note = linkNotes[Math.floor(Math.random() * linkNotes.length)]
    const url = linkUrls[Math.floor(Math.random() * linkUrls.length)]
    const user = people[Math.floor(Math.random() * people.length)]._id // finds random member to add
    const group = groups[Math.floor(Math.random() * groups.length)]._id // finds random member to add

    const newLink = new LinkSchema({
      name: name,
      note: note,
      url: url,
      user: user,
      group: group
    })

    insertLinks.push(newLink)
  }

  // Inserts many links into a mongodb collection
  await LinkSchema.insertMany(insertLinks)
  console.log('Inserted New Links 💎')
}
