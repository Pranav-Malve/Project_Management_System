import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
  name: "popup",
  initialState: {
    isCreateStudentModalOpen: false,
    isCreateTeacherModalOpen: false,
  },
  reducers: {
    togglStudentModel(state){
      state.isCreateStudentModalOpen = !state,isCreateStudentModalOpen;
      
    },
    toggleTeacherModel(state){
      state.isCreateTeacherModalOpen = !state,isCreateTeacherModalOpen;
    },
  },
});

export const {togglStudentModel, toggleTeacherModel} = popupSlice.actions; 
export default popupSlice.reducer;
