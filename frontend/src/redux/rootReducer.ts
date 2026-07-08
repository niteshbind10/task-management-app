import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/authSlice";
import taskReducer from "@/redux/slices/taskSlice";
import themeReducer from "@/redux/slices/themeSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  tasks: taskReducer,
  theme: themeReducer,
});

export default rootReducer;
