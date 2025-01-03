import { Response } from 'express';
import mongoose from 'mongoose';
import { CustomRequestWithUser } from '../types/request.type';
import { addInGroupService, createGroupService, fetchGroupService, getAllGroupsService, getMyMatchService, makeMatchesService, makeMatchesVisibleService } from '../services/seacretSanta.service';


export const createSecretSantaGroup = async (
  req: CustomRequestWithUser,
  res: Response,
): Promise<void> => {
  try {
    const user = req.user;

    if (!user || !user.id) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { group_name: groupName, max_members: maxMembers } = req.body;

    if (!groupName || typeof groupName !== 'string' || !groupName.trim()) {
      res.status(400).json({ message: 'Valid group name is required' });
      return;
    }

    if (!maxMembers || typeof maxMembers !== 'number' || maxMembers <= 0 || maxMembers > 100) {
      res.status(400).json({ message: 'Valid max members count is required' });
      return;
    }

    const admin = new mongoose.Types.ObjectId(user.id);
    const group = await createGroupService(admin, groupName.trim(), maxMembers);

    res.status(201).json({
      message: 'Group created successfully',
      groupId: group._id,
    });
  } catch (error: any) {
    console.error('Error creating Secret Santa group:', error); // Log full error for debugging
    res.status(500).json({
      error: 'Failed to create the group',
      details: error.message,
    });
  }
};


export const getAllGroups = async (
    req: CustomRequestWithUser,
    res: Response,
  ): Promise<void> => {
    try {
      const user = req.user;
  
      if (!user || !user.id) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
  
      const admin = new mongoose.Types.ObjectId(user.id);
      const { groupsAdmin, groupsMembers, remainingGroups } = await getAllGroupsService(admin);
  
      res.status(200).json({
        message: 'Groups fetched successfully',
        groupsAdmin: {
          count: groupsAdmin.length,
          groups: groupsAdmin,
        },
        groupsMembers: {
          count: groupsMembers.length,
          groups: groupsMembers,
        },
        remainingGroups: {
          count: remainingGroups.length,
          groups: remainingGroups,
        },
      });
    } catch (error: any) {
      console.error('Error fetching groups:', error); // Log full error for debugging
      res.status(500).json({
        error: 'Failed to fetch groups',
        details: error.message,
      });
    }
  };

  
  export const addInGroups = async (
    req: CustomRequestWithUser,
    res: Response,
  ): Promise<void> => {
    try {
      const user = req.user;
  
      if (!user || !user.id) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
  
      const userId = new mongoose.Types.ObjectId(user.id);
      const { group_id: groupId, group_name: groupName } = req.body;
  
      if (!groupId || !groupName) {
        res.status(400).json({ message: 'Valid group id and group name are required' });
        return;
      }
  
      // Call service to add user to the group
      await addInGroupService(userId, groupId, groupName);
  
      res.status(200).json({
        message: `User successfully added to the group '${groupName}'`,
      });
    } catch (error: any) {
      console.error('Error adding user to group:', error); // Log full error for debugging
      res.status(500).json({
        error: 'Failed to add user to the group',
        details: error.message,
      });
    }
  };

  export const makeMatches = async (
    req: CustomRequestWithUser,
    res: Response
  ): Promise<void> => {
    try {
      // Check if the user is authenticated
      const user = req.user;
      if (!user || !user.id) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
  
      // Extract group information from the request body
      const userId = new mongoose.Types.ObjectId(user.id);
      const { group_id: groupId, group_name: groupName } = req.body;
  
      // Validate the required fields
      if (!groupId || !groupName) {
        res.status(400).json({ message: 'Valid group id and group name are required' });
        return;
      }
  
      // Call the service to make matches
      const seacretMatches = await makeMatchesService(userId, groupId, groupName);
  
      // Respond with a success message and the generated matches
      res.status(200).json({
        message: 'Matches created successfully',
        matches: Array.from(seacretMatches.entries()), // Convert Map to an array of entries for easier viewing
      });
    } catch (error: any) {
      // Log the error and respond with a failure message
      console.error('Error creating matches:', error); // Log full error for debugging
      res.status(500).json({
        error: 'Failed to create matches',
        details: error.message,
      });
    }
  };
  

// Controller function to make matches visible
export const makeMatchesVisible = async (
    req: CustomRequestWithUser,
    res: Response
  ): Promise<void> => {
    try {
      // Check if the user is authenticated
      const user = req.user;
      if (!user || !user.id) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
  
      // Extract group information from the request body
      const userId = new mongoose.Types.ObjectId(user.id);
      const { group_id: groupId, group_name: groupName } = req.body;
  
      // Validate the required fields
      if (!groupId || !groupName) {
        res.status(400).json({ message: 'Valid group id and group name are required' });
        return;
      }
  
      // Call the service to make matches visible
      await makeMatchesVisibleService(userId, groupId, groupName);
  
      // Respond with a success message
      res.status(200).json({
        message: 'Group is successfully marked visible',
      });
    } catch (error: any) {
      // Log the error and respond with a failure message
      console.error('Error to mark group visible:', error); // Log full error for debugging
      res.status(500).json({
        error: 'Failed to mark group visible',
        details: error.message,
      });
    }
  };


  export const getOneGroup = async (
    req: CustomRequestWithUser,
    res: Response
  ): Promise<void> => {
    try {
      // Check if the user is authenticated
      const user = req.user;
      if (!user || !user.id) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
  
      // Extract group information from the request body
      const userId = new mongoose.Types.ObjectId(user.id);
      const { group_id: groupId, group_name: groupName } = req.body;
  
      // Validate the required fields
      if (!groupId || !groupName) {
        res.status(400).json({ message: 'Valid group ID and group name are required' });
        return;
      }
  
      // Call the service to fetch group details
      const group = await fetchGroupService(userId, new mongoose.Types.ObjectId(groupId), groupName);
  
      // Respond with the group details
      res.status(200).json({
        message: 'Group details retrieved successfully',
        group_members: group.group_members,
        matches: group.matches,
      });
    } catch (error: any) {
      // Log the error and respond with a failure message
      console.error('Error retrieving group details:', error.message); // Log full error for debugging
      res.status(500).json({
        error: 'Failed to retrieve group details',
        details: error.message,
      });
    }
  };

  export const getMyMatch = async (
    req: CustomRequestWithUser,
    res: Response
  ): Promise<void> => {
    try {
      // Check if the user is authenticated
      const user = req.user;
      if (!user || !user.id) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
  
      // Extract group information from the request body
      const userId = new mongoose.Types.ObjectId(user.id);
      const { group_id: groupId, group_name: groupName } = req.body;
  
      // Validate the required fields
      if (!groupId || !groupName) {
        res.status(400).json({ message: 'Valid group ID and group name are required' });
        return;
      }
  
      // Call the service to fetch match details
      const match = await getMyMatchService(
        userId,
        new mongoose.Types.ObjectId(groupId),
        groupName
      );
  
      // Respond with the match details
      res.status(200).json({
        message: 'Match details retrieved successfully',
        match,
      });
    } catch (error: any) {
      // Log the error and respond with a failure message
      console.error('Error retrieving match details:', error.message); // Log full error for debugging
      res.status(500).json({
        error: 'Failed to retrieve match details',
        details: error.message,
      });
    }
  };
  