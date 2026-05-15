import type { ProjectItem } from "../types";

export const projects: ProjectItem[] = [
  {
    name: "CSCI232-Labs",
    course: "Data Structures & Algorithms",
    summary:
      "C++ lab solutions covering linked lists, sorted lists, stacks, queues, binary search trees, AVL trees, and spell-checking style data structure problems.",
    url: "https://github.com/WillAugustine/CSCI232-Labs",
    technologies: ["C++", "Data Structures", "Algorithms", "Testing"],
    highlights: [
      "Implemented core data structures from scratch.",
      "Worked through stack, queue, tree, and search problems.",
      "Organized lab solutions with instructions and grading references.",
    ],
  },
  {
    name: "CSCI135-Labs",
    course: "Fundamentals of Computer Science I",
    summary:
      "Python lab collection for introductory programming concepts including command-line utilities, conditionals, loops, lists, dictionaries, functions, exceptions, classes, and a Tkinter calculator.",
    url: "https://github.com/WillAugustine/CSCI135-Labs",
    technologies: ["Python", "Tkinter", "CLI", "OOP"],
    highlights: [
      "Built a foundation in Python syntax and program structure.",
      "Practiced input handling, control flow, data collections, and functions.",
      "Extended into exceptions, class-based design, and a small GUI calculator.",
    ],
  },
  {
    name: "MontanaTech-CSCI232",
    course: "GitHub Lab Materials",
    summary:
      "Course support repository focused on Git and GitHub workflow basics for CSCI 232, including branching, status checks, commits, pulls, and pushes.",
    url: "https://github.com/WillAugustine/MontanaTech-CSCI232",
    technologies: ["Git", "GitHub", "Documentation", "Workflow"],
    highlights: [
      "Documented practical GitHub setup and repository workflow.",
      "Covered common source-control commands used in team development.",
      "Shows early attention to repeatable development process.",
    ],
  },
  {
    name: "CSCI136-Labs",
    course: "Fundamentals of Computer Science II",
    summary:
      "Python and C++ lab solutions for intermediate programming problems, including Benford analysis, traveling salesperson, maze solving, recursion, web crawling, networking, and C++ starter exercises.",
    url: "https://github.com/WillAugustine/CSCI136-Labs",
    technologies: ["Python", "C++", "Recursion", "Networking"],
    highlights: [
      "Solved algorithmic and simulation-style lab problems.",
      "Worked with stacks, queues, recursion, web crawling, and networking.",
      "Bridged Python problem solving with C++ fundamentals.",
    ],
  },
  {
    name: "ESOF322",
    course: "Software Engineering",
    summary:
      "Archived software engineering coursework with prototypes, specifications, data models, test planning, and a final Discord bot project.",
    url: "https://github.com/WillAugustine/ESOF322",
    technologies: ["Python", "Discord API", "Jira", "Requirements"],
    status: "Archived",
    highlights: [
      "Captured requirements, prototypes, test planning, and project documentation.",
      "Used Jira and software-engineering process artifacts.",
      "Final project explored Discord bot development with external APIs.",
    ],
  },
];
