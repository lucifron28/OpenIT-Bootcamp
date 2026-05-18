import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:5001/api';

export const getStudents = async () => {
    try {
        const response = await fetch(`${API_URL}/students`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching students:', error);
    }
}

export const getStudentById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/students/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching student:', error);
    }
}

export const createStudent = async (studentData) => {
    try {
        const response = await fetch(`${API_URL}/students`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(studentData),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating student:', error);
    }
}

export const updateStudent = async (id, studentData) => {
    try {
        const response = await fetch(`${API_URL}/students/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(studentData),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating student:', error);
    }
}


export const deleteStudent = async (id) => {
    try {
        const response = await fetch(`${API_URL}/students/${id}`, {
            method: 'DELETE',
        });
        return response.ok;
    } catch (error) {
        console.error('Error deleting student:', error);
    }
}