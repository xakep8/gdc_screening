const fs = require("fs");
const args = process.argv.slice(2);
var path=args[0];
// console.log(path);

var exists = fs.existsSync(`${path}/task.txt`);
if (!exists) {
  fs.writeFileSync(`${path}/task.txt`, "");
}

var exists = fs.existsSync(`${path}/completed.txt`);
if (!exists) {
  fs.writeFileSync(`${path}/completed.txt`, "");
}

const proc = args[1];
var tasks = [];

function displayableString(tasks) {
  var list = tasks.map((task) => {
    return `${task[0]} ${task[1]}`;
  });
  return list;
}

switch (proc) {
  case "add":
    if (args[2] === undefined || args[3] === undefined) {
      console.log("Error: Missing tasks string. Nothing added!");
    }
    var data = fs.readFileSync(`${path}/task.txt`, "utf8", {
      encoding: "utf8",
      flag: "r",
    });
    var list = data.split("\n");
    list.pop();
    var tasks = [];
    list.forEach((task) => {
      const priority = parseInt(task.substring(0, task.indexOf(" ")));
      const title = task.substring(task.indexOf(" ") + 1);
      tasks.push([priority, title]);
    });
    tasks.push([args[2], args[3]]);
    tasks.sort((a, b) => a[0] - b[0]);
    var list = displayableString(tasks);
    fs.writeFileSync(`${path}/task.txt`, "");
    list.forEach(async (task) => {
      fs.appendFileSync(`${path}/task.txt`, task, (err) => {
        if (err) throw err;
      });
      fs.appendFileSync(`${path}/task.txt`, "\n", (err) => {
        if (err) throw err;
      });
    });
    console.log(`Added task: "${args[3]}" with priority ${args[2]}`);
    break;
  case "ls":
    var data = fs.readFileSync(`${path}/task.txt`, "utf8", {
      encoding: "utf8",
      flag: "r",
    });
    if (data.length === 0) {
      console.log("There are no pending tasks!");
    }
    var list = data.split("\n");
    list.pop();
    var tasks = [];
    list.forEach((task, idx) => {
      const priority = parseInt(task.substring(0, task.indexOf(" ")));
      const title = task.substring(task.indexOf(" ") + 1);
      tasks.push([priority, title]);
    });
    tasks.forEach((task, idx) => {
      console.log(`${idx + 1}. ${task[1]} [${task[0]}]`);
    });
    break;
  case "del":
    var idx = args[2];
    if (idx === undefined) {
      console.log("Error: Missing NUMBER for deleting tasks.");
      break;
    }
    var data = fs.readFileSync(`${path}/task.txt`, "utf8", {
      encoding: "utf8",
      flag: "r",
    });
    var list = data.split("\n");
    list.pop();
    if (idx > list.length || idx == 0) {
      console.log(
        `Error: task with index #${idx} does not exist. Nothing deleted.`,
      );
    } else {
      list.splice(idx - 1, 1);
      fs.writeFileSync(`${path}/task.txt`, "");
      list.forEach(async (task) => {
        fs.appendFileSync(`${path}/task.txt`, task, (err) => {
          if (err) throw err;
        });
        fs.appendFileSync(`${path}/task.txt`, "\n", (err) => {
          if (err) throw err;
        });
      });
      console.log(`Deleted task #${idx}`);
    }
    break;
  case "done":
    var idx = args[2];
    if (idx === undefined) {
      console.log("Error: Missing NUMBER for marking tasks as done.");
      break;
    }
    var data = fs.readFileSync(`${path}/task.txt`, "utf8", {
      encoding: "utf8",
      flag: "r",
    });
    var list = data.split("\n");
    list.pop();
    var tasks = [];
    list.forEach((task, idx) => {
      const priority = parseInt(task.substring(0, task.indexOf(" ")));
      const title = task.substring(task.indexOf(" ") + 1);
      tasks.push([priority, title]);
    });
    if (idx > list.length || idx == 0) {
      console.log(`Error: no incomplete item with index #${idx} exists.`);
    } else {
      var temp = tasks[idx - 1];
      list.splice(idx - 1, 1);
      fs.writeFileSync(`${path}/task.txt`, "");
      list.forEach(async (task) => {
        fs.appendFileSync(`${path}/task.txt`, task, (err) => {
          if (err) throw err;
        });
        fs.appendFileSync(`${path}/task.txt`, "\n", (err) => {
          if (err) throw err;
        });
      });
      fs.appendFileSync(`${path}/completed.txt`, temp[1], (err) => {
        if (err) throw err;
      });
      fs.appendFileSync(`${path}/completed.txt`, "\n", (err) => {
        if (err) throw err;
      });
      console.log(`Marked item as done.`);
    }
    break;
  case "help":
    console.log("Usage :-");
    console.log(
      '$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list',
    );
    console.log(
      "$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order",
    );
    console.log(
      "$ ./task del INDEX            # Delete the incomplete item with the given index",
    );
    console.log(
      "$ ./task done INDEX           # Mark the incomplete item with the given index as complete",
    );
    console.log("$ ./task help                 # Show usage");
    console.log("$ ./task report               # Statistics");
    break;
  case "report":
    var data = fs.readFileSync(`${path}/task.txt`, "utf8", {
      encoding: "utf8",
      flag: "r",
    });
    var list = data.split("\n");
    list.pop();
    var tasks = [];
    list.forEach((task, idx) => {
      const priority = parseInt(task.substring(0, task.indexOf(" ")));
      const title = task.substring(task.indexOf(" ") + 1);
      tasks.push([priority, title]);
    });
    console.log(`Pending : ${tasks.length}`);
    tasks.forEach((task, idx) => {
      console.log(`${idx + 1}. ${task[1]} [${task[0]}]`);
    });
    var data = fs.readFileSync(`${path}/completed.txt`, "utf8", {
      encoding: "utf8",
      flag: "r",
    });
    var list = data.split("\n");
    list.pop();
    console.log("");
    console.log(`Completed : ${list.length}`);
    list.forEach((task, idx) => {
      console.log(`${idx + 1}. ${task}`);
    });
    break;
  default:
    console.log("Usage :-");
    console.log(
      '$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list',
    );
    console.log(
      "$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order",
    );
    console.log(
      "$ ./task del INDEX            # Delete the incomplete item with the given index",
    );
    console.log(
      "$ ./task done INDEX           # Mark the incomplete item with the given index as complete",
    );
    console.log("$ ./task help                 # Show usage");
    console.log("$ ./task report               # Statistics");
    break;
}
