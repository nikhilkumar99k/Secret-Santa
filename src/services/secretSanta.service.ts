import mongoose from 'mongoose';
import { Group, Groups } from '../mongoDb/models/groups';
import { MongoService } from '../mongoDb/services/mongoService';
import { Users } from '../mongoDb/models/users';
import { SecterMatches } from '../mongoDb/models/secretMatches';
import { shuffleArray } from '../util';

export const createGroupService = async (
  admin: mongoose.Types.ObjectId,
  groupName: string,
  maxMembers: number,
): Promise<any> => {
  try {
    const newGroup = new Groups({
      group_name: groupName,
      admin: admin,
      members: [admin],
      max_members: maxMembers,
    });

    return await MongoService.create(newGroup);
  } catch (error: any) {
    console.error('Error creating the group:', error.message);
    throw new Error('Unable to create the group: ' + error.message);
  }
};

export const getAllGroupsService = async (
    admin: mongoose.Types.ObjectId
  ): Promise<{
    groupsAdmin: Group[];  // Corrected type to Group[]
    groupsMembers: Group[];
    remainingGroups: Group[];
  }> => {
    try {
      // Fetch groups where the user is the admin
      const groupsAdmin = await Groups.find({ admin });
  
      // Fetch groups where the user is a member
      const groupsMembers = await Groups.find({ members: { $in: [admin] } });
  
      // Fetch groups where the user is neither an admin nor a member, and `is_matches` is false
      const remainingGroups = await Groups.find({
        admin: { $ne: admin },
        members: { $nin: [admin] },
        is_matches: false,
      });
  
      return { groupsAdmin, groupsMembers, remainingGroups };
    } catch (error: any) {
      console.error('Error in fetching groups:', error.message);
      throw new Error('Unable to fetch groups: ' + error.message);
    }
  };
  
export const addInGroupService = async (
    userId: mongoose.Types.ObjectId,
    groupId: mongoose.Types.ObjectId,
    groupName: string
  ): Promise<void> => {
    try {
      const group = await Groups.findById(groupId);
  
      if (!group) {
        throw new Error('Group not found');
      }
  
      // Check if the group name matches
      if (group.group_name !== groupName) {
        throw new Error('Group name mismatch');
      }
  
      // Add user to the group's members array
      if (group.members.includes(userId)) {
        throw new Error('User is already a member of the group');
      }
  
      group.members.push(userId);
  
      // Save the updated group document
      await group.save();
  
    } catch (error: any) {
      console.error('Error in adding user to group:', error.message);
      throw new Error('Unable to add user to the group: ' + error.message);
    }
  };

export const makeMatchesService = async (
  userId: mongoose.Types.ObjectId,
  groupId: mongoose.Types.ObjectId,
  groupName: string
): Promise<Map<mongoose.Types.ObjectId, mongoose.Types.ObjectId>> => {
  try {
    const group = await Groups.findById(groupId);

    if (!group) {
      throw new Error('Group not found');
    }

    // Check if the group name matches
    if (group.group_name !== groupName) {
      throw new Error('Group name mismatch');
    }

    // Only the admin is allowed to make matches
    if (group.admin.toString() !== userId.toString()) {
      throw new Error('User is not allowed to make matches. Only admin can make matches');
    }

    // Generate matches using the matching algorithm
    const seacretMatches = await makeMatchesAlgo(group.members);

    // Store matches in SeacterMatches collection
    const newSeacterMatches = new SecterMatches({
      group_id: groupId,
      matches: seacretMatches,
    });

    // Save the new matches to the database
    await newSeacterMatches.save();

    group.is_matches = true; // Mark the group as having completed matches
    await group.save();

    return seacretMatches;
  } catch (error: any) {
    console.error('Error in making matches:', error.message);
    throw new Error('Unable to make matches: ' + error.message);
  }
};
  
  export const makeMatchesAlgo = async (
    members: mongoose.Types.ObjectId[]
  ): Promise<Map<mongoose.Types.ObjectId, mongoose.Types.ObjectId>> => {
    try {
      const matches = new Map<mongoose.Types.ObjectId, mongoose.Types.ObjectId>();
  
      // Shuffle the members array using myFunction
      const shuffledMembers = shuffleArray(members);
  
      // Circularly match members (wrap around to the first member after the last one)
      for (let i = 0; i < shuffledMembers.length; i++) {
        const currentMember = shuffledMembers[i];
        const nextMember = shuffledMembers[(i + 1) % shuffledMembers.length]; // The next member, or first if at the end
  
        matches.set(currentMember, nextMember);
      }
  
      return matches;
    } catch (error: any) {
      console.error('Error in matching algorithm:', error.message);
      throw new Error('Unable to create matches: ' + error.message);
    }
  };
  
// Service function to handle the business logic
export const makeMatchesVisibleService = async (
    userId: mongoose.Types.ObjectId,
    groupId: mongoose.Types.ObjectId,
    groupName: string
  ): Promise<void> => {
    try {
      // Retrieve the group from the database
      const group = await Groups.findById(groupId);
    
      if (!group) {
        throw new Error('Group not found');
      }
  
      // Validate the group name
      if (group.group_name !== groupName) {
        throw new Error('Group name mismatch');
      }
  
      // Ensure only the admin can make matches visible
      if (group.admin.toString() !== userId.toString()) {
        throw new Error('User is not allowed to make matches. Only admin can make matches');
      }
  
      // Ensure matches are created before making them visible
      if (!group.is_matches) {
        throw new Error('Matches not created for group');
      }
  
      // Ensure matches are not already visible
      if (group.matches_visible) {
        throw new Error('Matches already visible');
      }
  
      // Mark the group as having completed matches
      group.matches_visible = true;
      await group.save();
    
      return;
    } catch (error: any) {
      // Log the error for debugging
      console.error('Error in making matches visible:', error.message);
      throw new Error('Unable to make matches visible: ' + error.message);
    }
  };


  export const fetchGroupService = async (
    userId: mongoose.Types.ObjectId,
    groupId: mongoose.Types.ObjectId,
    groupName: string
  ): Promise<{ group_members: mongoose.Types.ObjectId[]; matches: any | null }> => {
    try {
      // Retrieve the group from the database
      const group = await Groups.findById(groupId);
  
      if (!group) {
        throw new Error('Group not found');
      }
  
      // Validate the group name
      if (group.group_name !== groupName) {
        throw new Error('Group name mismatch');
      }
  
      // Initialize response with group members
      const response: {
        group_members: mongoose.Types.ObjectId[];
        matches: Map<mongoose.Types.ObjectId, mongoose.Types.ObjectId> | null;
      } = {
        group_members: group.members,
        matches: null, // Initial value is null
      };
      
  
      // Check if the user is admin or matches are visible
      if (group.matches_visible || group.admin.toString() !== userId.toString()) {
        const matches = await SecterMatches.findOne({ group_id: groupId });
        response.matches = matches?.matches || null;
      }
  
      return response;
    } catch (error: any) {
      // Log the error for debugging
      console.error('Error in fetching group details:', error.message);
      throw new Error('Unable to fetch group details: ' + error.message);
    }
  };
  
  export const getMyMatchService = async (
    userId: mongoose.Types.ObjectId,
    groupId: mongoose.Types.ObjectId,
    groupName: string
  ): Promise<any> => {
    try {
      // Retrieve the group from the database
      const group = await Groups.findById(groupId);
  
      if (!group) {
        throw new Error('Group not found');
      }
  
      // Validate the group name
      if (group.group_name !== groupName) {
        throw new Error('Group name mismatch');
      }
  
      // Ensure matches are created and visible for the group
      if (!group.is_matches) {
        throw new Error('Matches are not created for this group');
      }
      if (!group.matches_visible) {
        throw new Error('Matches are not allowed to be visible');
      }
  
      // Retrieve matches for the group
      const matches = await SecterMatches.findOne({ group_id: groupId });
      if (!matches) {
        throw new Error('Matches are not created for this group');
      }
  
      // Get the match for the given user ID
      const myMatch = matches.matches.get(userId);
      if (!myMatch) {
        throw new Error('You are not in this group');
      }
  
      // Retrieve the matched user's details
      const myMatchUser = await Users.findById(myMatch);
      if (!myMatchUser) {
        throw new Error('Matched user not found');
      }
  
      return myMatchUser;
    } catch (error: any) {
      // Log the error for debugging
      console.error('Error in fetching user match:', error.message);
      throw new Error('Unable to fetch user match: ' + error.message);
    }
  };
  