import CareSchedule from '../Models/CareSchedule.js';

// Create a new CareSchedule
export const createCareSchedule = async (req, res) => {
  try {
    const { user_id, product_id, task_type, task_date, notes } = req.body;
    if (!product_id || !task_type || !task_date) {
      return res.status(400).json({ statusCode: 400, message: "product_id, task_type, and task_date are required." });
    }

    const newCareSchedule = await CareSchedule.create({
      user_id,
      product_id,
      task_date,
      task_type,
      notes
    });

    res.status(201).json({ statusCode: 201, message: 'Care schedule created', data: { careSchedule: newCareSchedule } });
  } catch (error) {
    console.error('Error creating care schedule:', error);
    res.status(500).json({ statusCode: 500, message: 'Server error', error: error.message });
  }
};

// Get all CareSchedules
export const getAllCareSchedules = async (req, res) => {
  try {
    const careSchedules = await CareSchedule.findAll();
    res.status(200).json({ statusCode: 200, message: 'Care schedules fetched successfully', data: careSchedules });
  } catch (error) {
    console.error('Error fetching care schedules:', error);
    res.status(500).json({ statusCode: 500, message: 'Server error', error: error.message });
  }
};

// Get CareSchedule by ID
export const getCareScheduleById = async (req, res) => {
  try {
    const { id } = req.params;
    const careSchedule = await CareSchedule.findByPk(id);

    if (!careSchedule) {
      return res.status(404).json({ statusCode: 404, message: 'Care schedule not found' });
    }

    res.status(200).json({ statusCode: 200, message: 'Care schedule fetched successfully', data: careSchedule });
  } catch (error) {
    console.error('Error fetching care schedule:', error);
    res.status(500).json({ statusCode: 500, message: 'Server error', error: error.message });
  }
};

// Update CareSchedule
export const updateCareSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, product_id, task_date, task_type, notes } = req.body;

    const careSchedule = await CareSchedule.findByPk(id);
    if (!careSchedule) {
      return res.status(404).json({ statusCode: 404, message: 'Care schedule not found' });
    }

    careSchedule.user_id = user_id || careSchedule.user_id; // Update only if provided
    careSchedule.product_id = product_id || careSchedule.product_id;
    careSchedule.task_date = task_date || careSchedule.task_date;
    careSchedule.task_type = task_type || careSchedule.task_type;
    careSchedule.notes = notes || careSchedule.notes;

    await careSchedule.save();

    res.status(200).json({ statusCode: 200, message: 'Care schedule updated', data: careSchedule });
  } catch (error) {
    console.error('Error updating care schedule:', error);
    res.status(500).json({ statusCode: 500, message: 'Server error', error: error.message });
  }
};

// Delete CareSchedule
export const deleteCareSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const careSchedule = await CareSchedule.findByPk(id);
    if (!careSchedule) {
      return res.status(404).json({ statusCode: 404, message: 'Care schedule not found' });
    }

    await careSchedule.destroy();
    res.status(200).json({ statusCode: 200, message: 'Care schedule deleted' });
  } catch (error) {
    console.error('Error deleting care schedule:', error);
    res.status(500).json({ statusCode: 500, message: 'Server error', error: error.message });
  }
};

export default {
  createCareSchedule,
  getAllCareSchedules,
  getCareScheduleById,
  updateCareSchedule,
  deleteCareSchedule
};
