const { StudentProfile } = require('../src/db/studentProfiles')
const { GroupSchema } = require('../src/db/groups')
const { MeetingSchema } = require('../src/db/meetings')
const { db } = require('../src/db')

const studentFirstNames = ['Dave', 'Steve', 'Will', 'Jess', 'Emily', 'Rebecca']
const studentLastNames = ['Stevens', 'Williams', 'Denham', 'Tobias', 'Taylor', 'Bench']
const groupNames = ['Dilly', 'Dally', 'Late', 'Submission', 'Jam', 'Group']
const meetingNames = ['Study', 'Chat', 'Braai', 'Lunch', 'Coffee']
const tags = ['Fun', 'Rocks', 'Math', 'Interactive']
const coords = [[23.3645, 34.0575], [28.0473, 26.2041]] // plett, joburg coords

generateStudents(studentFirstNames, studentLastNames, 10)
  .then(() => generateGroups(groupNames, 5))
  .then(() => generateMeetings(meetingNames))
  .then(() => db.close())
  .catch(err => {
    console.error('Error:', err)
  })

async function generateStudents (firstNames, lastNames, numStudents) {
  const insertStudents = []
  const location = 'Wits'
  const coordinates = [28.0305, 26.1929] // longitude latitude for wits
  const geodata = {
    type: 'Point',
    coords: coordinates
  }

  // generate a random set of user profile data
  for (let i = 0; i < numStudents; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const newStudent = {
      email: `${firstName}.${lastName}${i}@test.com`,
      firstName: firstName,
      lastName: lastName,
      password: '',
      groups: [],
      username: `${firstName}${lastName}${i}`,
      location,
      geodata
    }
    insertStudents.push(newStudent)
  }
  // Deletes all the current data in there to start fresh
  await StudentProfile.deleteMany({})
  console.log('Dropped Students Collection 🔮')
  // Inserts many students into a mongodb collection
  await StudentProfile.insertMany(insertStudents)
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
      tags: addedTags
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

async function generateMeetings (meetingNames) {
  // Deletes all the current data in there to start fresh this ensures the collections exists before dropping it, otherwise an error occurs
  await MeetingSchema.deleteMany({})
  console.log('Dropped Meetings Collection 🔮')

  const groups = await GroupSchema.find({}) // finds all groups in the database

  // generate a random set of user group data
  let index = 0
  for (const group of groups) {
    const first = meetingNames[Math.floor(Math.random() * meetingNames.length)] // creates random group name
    const last = meetingNames[Math.floor(Math.random() * meetingNames.length)]
    const addedMembers = group.members.toObject() // sets members of meetings to group members
    const coord = coords[Math.floor(Math.random() * coords.length)] // gets random coord

    const newMeeting = new MeetingSchema({
      name: `${first} ${last} ${index}`,
      description: `This is generated by the seeds file! Meeting number: ${index}`,
      group: group._id,
      attendees: addedMembers,
      location: { type: 'Point', cooridinates: coord }
    })
    const savedMeeting = await newMeeting.save() // saves meeting
    await GroupSchema.findByIdAndUpdate(group._id, { $push: { meetings: savedMeeting._id } }) // adds meeting to this group
    index++
  }
  console.log('Inserted New Meetings 💎')
}
