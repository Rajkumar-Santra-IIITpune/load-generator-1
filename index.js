const io = require('socket.io-client');
const axios = require('axios');

const ANALYTICS_URL = process.env.ANALYTICS_URL || 'http://localhost:3000';
const GENERATOR_NAME = 'Load Generator 1';

const socket = io(ANALYTICS_URL);

socket.on('connect', () => {
    console.log(`Connected to analytics server as ${GENERATOR_NAME}`);
});

function generateTask() {
    return {
        id: `t_${Math.random().toString(36).substring(7)}`,
        releaseTime: Date.now(),
        deadline: Date.now() + Math.floor(Math.random() * 5000) + 1000, // 1-6s deadline
        executionTime: Math.floor(Math.random() * 1000) + 100, // 100-1100ms execution
        utilization: Math.random() * 0.4 + 0.1 // 0.1 to 0.5 utilization
    };
}

function startLoadGeneration() {
    setInterval(async () => {
        const taskCount = Math.floor(Math.random() * 5) + 1;
        const tasks = Array.from({ length: taskCount }, generateTask);
        
        try {
            socket.emit('report_load', {
                generator: GENERATOR_NAME,
                tasks: tasks,
                timestamp: Date.now()
            });
            console.log(`Sent ${taskCount} tasks to analytics server`);
        } catch (error) {
            console.error('Error sending load:', error.message);
        }
    }, 2000); // Generate load every 2 seconds
}

startLoadGeneration();
