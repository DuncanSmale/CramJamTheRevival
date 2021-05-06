const { GroupSchema } = require('../db/groups')
const { StudentProfile } = require('../db/studentProfiles')
// Public

module.exports.index = async (req, res) => {
  const userGroups = req.user.groups
  const groups = await GroupSchema.find({ _id: { $in: userGroups } })
  res.render('groups/index', { groups })
}

module.exports.renderNewForm = (req, res) => {
  res.render('groups/new')
}

module.exports.createGroup = async (req, res, next) => {
  const group = new GroupSchema({
    name: req.body.name,
    members: [req.user._id]
  })
  // group.members = [req.user._id]
  await group.save()
  const user = await StudentProfile.findById(req.user._id)
  user.groups.push(group._id)
  await user.save()
  // req.flash('success', 'Created new group!')
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
  const { id } = req.params
  const group = await GroupSchema.findById(id)
  const members = group.members
  await GroupSchema.findByIdAndDelete(id)
  await StudentProfile.updateMany({ _id: { $in: members } },
    { $pull: { groups: id } })
  res.redirect('/groups')
}

module.exports.deleteGroupMember = async (req, res) => {
  const groupId = req.params.id
  const memberId = req.params.member
  const group = await GroupSchema.findById(groupId)
  if (group.members.length === 1) {
    await GroupSchema.remove({ _id: groupId })
  } else {
    await GroupSchema.updateOne({ _id: groupId },
      { $pull: { members: memberId } })
  }
  await StudentProfile.updateOne({ _id: memberId },
    { $pull: { groups: groupId } })
  res.redirect('/groups')
}
