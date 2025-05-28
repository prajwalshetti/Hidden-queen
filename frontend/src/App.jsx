import { useState } from 'react'
import './App.css'
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom"; 
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import ChessGame from "./components/ChessGame";
import About from "./components/About";
import Rules from "./components/Rules";
import HQChessGame from './components/HQChessGame';
import PPChessGame from './components/PPChessGame';
import FBChessGame from './components/FBChessGame';
import FeedbackForm from './components/Feedback';
import Settings from './components/Settings';
import MKChessGame from './components/MKChessGame';
import { Analytics } from '@vercel/analytics/react';
import ScrollToTop from './utils/ScrollToTop';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop/>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chessGame" element={<ChessGame />} />
        <Route path="/hqchessGame" element={<HQChessGame />} />
        <Route path="/ppchessGame" element={<PPChessGame />} />
        <Route path="/fbchessgame" element={<FBChessGame />} />
        <Route path="/mkchessgame" element={<MKChessGame />} />
        {/* Added dashboard route that redirects to root */}
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="rules" element={<Rules />} /> 
          <Route path="about" element={<About />} /> 
          <Route path="feedback" element={<FeedbackForm />} /> 
          <Route path="settings" element={<Settings />} /> 
        </Route>
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}

export default App