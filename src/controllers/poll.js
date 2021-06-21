const { Poll } = require('../db/poll')
const { StudentProfile } = require('../db/studentProfiles')
const { GroupSchema } = require('../db/groups')
const groups = require('./groups')

module.exports.showPoll = async (req, res) => {
  const { poll } = req.params
  const found = await Poll.findById(poll)
  const affected = await StudentProfile.findById(found.affected)
  const group = await GroupSchema.findById(found.group)
  res.render('polls/vote', { poll: found, affected, group })
}

module.exports.showAllPolls = async (req, res) => {
  const polls = await Poll.find({})
  res.render('polls/allPolls', { polls })
}

module.exports.votePoll = async (req, res) => {
  const { poll, type } = req.params
  const votePoll = await Poll.findById(poll)
  await this.vote(votePoll, type)
  votePoll.voted.push(req.user._id)
  await votePoll.save()
  const members = [...votePoll.members]
  members.sort()
  const voted = [...votePoll.voted]
  voted.sort()
  if (voted.length > (members.length / 2)) { // checking sorted arrays
    req.flash('Poll closed', 'Majority voted')
    votePoll.active = false
    await votePoll.save()
    await this.updatePoll(votePoll._id, req)
  }
  await StudentProfile.updateMany({ _id: { $in: members } },
    { $pull: { polls: votePoll._id } })
  res.redirect('back')
}

module.exports.vote = async (poll, type) => {
  if (type === 'yes') {
    poll.votes.yes += 1
    await poll.save()
  } else {
    poll.votes.no += 1
    await poll.save()
  }
}

module.exports.newPoll = async (groupId, action, affected, members, owner) => {
  const newPoll = new Poll({
    members,
    name: `New poll from: ${owner}`,
    group: groupId,
    action,
    affected: affected
  })
  await newPoll.save()

  await StudentProfile.updateMany({ _id: { $in: members } },
    { $push: { polls: newPoll._id } })

  await GroupSchema.updateOne({ _id: groupId },
    { $push: { polls: newPoll._id } })
}

module.exports.createPoll = async (req, res) => {
  const { groupId, action, memberId } = req.params
  const userId = req.user._id

  // Check if user is attempting to delete themself
  if (userId.toString() == memberId && action === 'Remove') {
    req.flash('error', 'Member cannot create a poll to remove themself from a group')
    res.redirect('back')
    return
  }
  // Check if user is attempting to invite themself
  if (userId.toString() == memberId && action === 'Invite') {
    req.flash('error', 'Member cannot create a poll to invite themself to a group')
    res.redirect('back')
    return
  }

  // Check if the poll already exists
  const pollExists = await groups.isInPoll(groupId, memberId, action)

  if (pollExists) {
    req.flash('error', 'This poll already exists')
    res.redirect('back')
    return
  }

  // Find group
  const group = await GroupSchema.findById(groupId)

  // Create variables
  let members
  const affected = memberId

  // Returns true if a member exists in a group or if a member has already been invited into a group
  const isInGroup = await groups.isInGroup(groupId, memberId)
  const isInvited = await groups.isInvited(groupId, memberId)

  switch (action) {
    // Request to join a group that they are not already a part of
    // Should not already be in a group
    // Should not already have requested to join a group (checked already)
    // Voting members should be everyone already in the group
    case 'Add':
      if (isInGroup || isInvited) {
        req.flash('error', 'Member is already part of group')
        console.log('already here')
        res.redirect('back')
        return
      }
      members = group.members
      break

    // Poll to invite a new member to a group
    // Should not be able to invite someone who is already in a group (existsInGroup == false)
    // Should not be able to invite one's self (checked)
    // Should not be able to invite someone who has already been invited (existsInGroup == false)
    // Voting members should be everyone already in the group
    case 'Invite':
      if (isInGroup || isInvited) {
        req.flash('error', 'Member is already part of group')
        res.redirect('back')
        return
      }
      members = group.members
      break

    // Poll to remove someone from a group
    // Should not be able to create a poll to remove oneself
    // Should not be able to remove someone who is already in a remove poll
    // Should only be able to remove someone who is already in the group
    // Voting members should be everyone in the group except the affected member
    case 'Remove':
      if (!isInGroup) {
        req.flash('error', 'Member is not in group')
        res.redirect('back')
        return
      }
      members = group.members.filter(function (e) {
        return e != affected
      })
      break
  }
  await this.newPoll(groupId, action, affected, members, req.user.username)
  req.flash('success', 'Successfuly created new poll')
  res.redirect(`/groups/${groupId}`)
}

module.exports.updatePoll = async (pollId, req) => {
  const poll = await Poll.findById(pollId)
  const group = await GroupSchema.findById(poll.group)
  switch (poll.action) {
    case 'Add':
      await groups.addGroupMember(group._id, poll.affected)
        .then(done => {
          req.flash('success', 'Request Successful')
        }).catch(err => {
          req.flash('error', err)
        })
      break

    case 'Invite':
      await groups.invite(group._id, poll.affected)
        .then(done => {
          req.flash('success', 'Invite Successful')
        }).catch(err => {
          req.flash('error', err)
        })
      break

    case 'Remove':
      await groups.deleteMember(group._id, poll.affected)
        .then(done => {
          req.flash('success', 'Remove Successful')
        }).catch(err => {
          req.flash('error', err)
        })
      break
  }
  await GroupSchema.updateOne({ _id: group._id },
    { $pull: { polls: pollId } })
}
