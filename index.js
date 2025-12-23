#!/usr/bin/env node
const fs = require("fs");

// Colores ANSI
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m'
};

const args = process.argv.slice(2);
const command = args[0];
const param1 = args[1] || false;
const param2 = args[2] || false;
const FILE = "tasks.json";

if (!fs.existsSync(FILE)) {
  fs.writeFileSync(FILE, "[]");
  console.log(`${colors.green}✓ Created tasks.json file${colors.reset}`);
}

let tasks = JSON.parse(fs.readFileSync(FILE, "utf-8"));

class Task{
    constructor(id,description, status){
        this.id = id;
        this.description = description;
        this.status = status;
    }

}

switch (command) {
    case 'add':
        const newTask = new Task(tasks.length + 1, param1, "to do");
        tasks.push(newTask);
        fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
        console.log(`${colors.green}${colors.bright}✓ Task added successfully!${colors.reset}`);
        console.log(`  ${colors.cyan}${param1}${colors.reset}`);
        break;
    case "update":
        const taskToUpd = tasks.find(t => t.id == param1);
        if (!taskToUpd){
            console.log(`${colors.red}✗ Task not found${colors.reset}`);
            break;
        }
        taskToUpd.description = param2;
        fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
        console.log(`${colors.green}${colors.bright}✓ Task #${param1} updated!${colors.reset}`);
        console.log(` ${colors.cyan}${param2}${colors.reset}`);
        break;        
    case "delete":
        if(!tasks.find(t => t.id == param1)){
            console.log(`${colors.red}✗ Task not found${colors.reset}`);
            break;
        }
        tasks = tasks.filter ((i)=> i.id != param1);
        fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
        console.log(`${colors.green}${colors.bright}✓ Task #${param1} deleted!${colors.reset}`);
        break;
    case "list":
        if(tasks.length === 0){
            console.log(`${colors.yellow}No tasks found${colors.reset}`);
            break;
        }
        console.log(`\n${colors.bright}${colors.cyan}TASK LIST${colors.reset}`);
        console.log(`${colors.cyan}${'═'.repeat(60)}${colors.reset}`);
        tasks.forEach((task) =>{
            let statusIcon = task.status === "done" ? "✓" : task.status === "in progress" ? "⟳" : "○";
            let statusColor = task.status === "done" ? colors.green : task.status === "in progress" ? colors.yellow : colors.magenta;
            console.log(`${colors.bright}#${task.id}${colors.reset} ${statusColor}${statusIcon}${colors.reset} ${task.description}`);
            console.log(`   ${statusColor}[${task.status.toUpperCase()}]${colors.reset}`);
            console.log(`${colors.cyan}${'-'.repeat(60)}${colors.reset}`);
        })
        break;
    case "mark-done":
        const taskDone = tasks.find(t => t.id == param1);
        if (!taskDone){
            console.log(`${colors.red}✗ Task not found${colors.reset}`);
            break;
        }
        taskDone.status = "done";
        fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
        console.log(`${colors.green}${colors.bright}✓ Task #${param1} marked as DONE!${colors.reset}`);
        break;
    case "mark-todo":
        const taskTodo = tasks.find(t => t.id == param1);
        if (!taskTodo){
            console.log(`${colors.red}✗ Task not found${colors.reset}`);
            break;
        }
        taskTodo.status = "to do";
        fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
        console.log(`${colors.magenta}${colors.bright}○ Task #${param1} marked as TO DO${colors.reset}`);
        break;
    case "mark-in-progress":
        const taskProgress = tasks.find(t => t.id == param1);
        if (!taskProgress){
            console.log(`${colors.red}✗ Task not found${colors.reset}`);
            break;
        }
        taskProgress.status = "in progress";
        fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
        console.log(`${colors.yellow}${colors.bright}⟳ Task #${param1} marked as IN PROGRESS${colors.reset}`);
        break;
    case "--help":
        console.log(`\n${colors.cyan}Available commands:${colors.reset}`);
        console.log(`  ${colors.green}add${colors.reset} <description>`);
        console.log(`  ${colors.green}list${colors.reset}`);
        console.log(`  ${colors.green}update${colors.reset} <id> <description>`);
        console.log(`  ${colors.green}delete${colors.reset} <id>`);
        console.log(`  ${colors.green}mark-done${colors.reset} <id>`);
        console.log(`  ${colors.green}mark-in-progress${colors.reset} <id>`);
        console.log(`  ${colors.green}mark-todo${colors.reset} <id>`);
        console.log(`  ${colors.green}--help${colors.reset}\n`);
        break;

    default:
        console.log(`${colors.red}✗ Unknown command: ${command}${colors.reset}, use --help to see available commands.`);
    
}