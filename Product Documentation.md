# Production Documentation: SelfMade

## 1.0 Product Idea

SelfMade is a task management application designed to bring the power of advanced, workflow-based systems to the individual user. The current market for productivity tools is polarized. On one end are overly simplistic to-do list applications that lack the structure for managing complex projects. On the other end are powerful, team-oriented project management suites that are cluttered, complicated, and poorly suited for an individual's personal or professional life.

SelfMade fills this gap. The core idea is that allowing an individual to define and manage their own workflows provides significant advantages over a simple checklist or a basic Kanban board. It enables a structured, repeatable process for personal projects, creative endeavors, and life management, offering clarity and power without the corporate-focused complexity.

## 2.0 Philosophy

The development and ethos of SelfMade are guided by three core principles:

1.  **Total User Control:** Users must have absolute ownership and control over their data. The application will feature robust, simple-to-use export and import functionality, allowing a user to take their entire dataset with them at any time, in a non-proprietary format. Your data is yours, period.
2.  **Intentionally for Individuals:** SelfMade is built exclusively for the individual. Unlike most task management apps, it will not pivot to include team features, enterprise collaboration, or business-centric functions. This focus ensures that the user experience remains clean, relevant, and free from the clutter that plagues team-based tools.
3.  **Open and Transparent:** The project will be open-source. This fosters transparency, allows for community contributions, and gives users the ultimate assurance of the tool's longevity and security.

## 3.0 Target Users

SelfMade is designed for any individual who needs a simple yet powerful system to manage their tasks and projects without the overhead of a business-oriented tool. This includes, but is not limited to:

* **Freelancers & Solo Entrepreneurs:** Managing multiple client projects and business tasks.
* **Artists & Creatives:** Structuring the creative process from idea to finished work.
* **Students:** Organizing coursework, research, and personal deadlines.
* **Parents & Homemakers:** Managing complex household projects, schedules, and family goals.
* **Anyone working on a solo project:** From writing a book to learning a new skill or planning a personal event.

## 4.0 Project Plan

This project will follow a solo, iterative, and AI-assisted development model.

* **Development Team:** The project will be developed by a sole developer. This ensures a unified vision and lean execution.
* **AI-Leveraged Process:** Artificial intelligence will be leveraged across all stages of the product lifecycle, including:
    * **Product Research:** Analyzing market gaps and user needs.
    * **Design:** Generating UI/UX concepts and visual assets.
    * **Development:** Assisting with code generation, debugging, and best practices.
    * **Deployment:** Automating builds and managing cloud infrastructure.
* **Iterative Rollout:** The development will be incremental. The initial version will focus on delivering the core, stable functionality (Projects, Tasks, basic statuses). Subsequent versions will iteratively introduce more advanced features like custom fields, views, and tags. This ensures a high-quality, focused product that can be built upon methodically.


#### **4.1 Incremental Build Plan (MVPs)**

The development will be broken down into the following Minimum Viable Product (MVP) releases:

**MVP 1: Core Engine**
*Focus: Establish the fundamental ability to create and manage tasks.*
* `Project` Management (Create, Read, Update, Delete)
* `Task` Management (Create, Read, Update, Delete)
* Standard Task Fields: `Title`, `Description`
* Default `Status` options (`To Do`, `In Progress`, `Done`)
* The essential `To Do` (List) View to display projects and their tasks.

**MVP 2: Enhanced Organization**
*Focus: Introduce hierarchy and more detailed task properties.*
* Infinite `Task` Nesting (Parent-Child relationships)
* Additional Standard Fields: `StartDate`, `EndDate`, `Priority`
* `Custom Tags` functionality (Create, add to tasks, filter by tag)

**MVP 3: Advanced Customization**
*Focus: Deliver the app's most powerful personalization features.*
* `Custom Workflows` (Allow users to create and edit `Status` options per project)
* `Custom Fields` (Support for Number, Small/Large Text, Dropdown, Checkbox)
* Enable `Markdown` support in the `Description` and `Large Text` custom fields.

**MVP 4: Data & Visualization**
*Focus: Fulfill the data ownership philosophy and provide new ways to view tasks.*
* `Calendar View` implementation
* Full `Data Export` functionality (e.g., to JSON or CSV)
* Full `Data Import` functionality

## 5.0 Design & Theme

The visual design of SelfMade directly supports its core philosophy of being a simple, uncluttered, and powerful tool for individuals. The aesthetic will be minimalist, prioritizing clarity, readability, and a calm user experience.

### 5.1 Color Palette

The color theme is built on a foundation of white space, using color intentionally and sparingly to guide the user and draw attention only to what is necessary.

* **Dominant Color: White (`#FFFFFF`)**
    The vast majority of the user interface—backgrounds, content areas, and panels—will be white. This creates a bright, open, and distraction-free environment that allows the user's content to be the primary focus.

* **Primary Accent: Blue**
    A clear, accessible blue will be used for primary actions, interactive elements, links, and selections. This color signifies calm productivity and indicates where a user can interact with the system.

* **Secondary Accent: Red**
    A sharp, distinct red will be used with restraint for high-importance signals. Its use cases include notifications, urgent priority markers, overdue item indicators, and confirmation for destructive actions (like deleting a task). This ensures that when the user sees red, they know it requires their attention.

## 6.0 Core Data Objects & Hierarchy

The data architecture of SelfMade is designed to be simple, intuitive, and flexible, revolving around two primary objects: **Projects** and **Tasks**.

### 6.1 Project

The **Project** is the highest-level organizational container in SelfMade. It serves as a dedicated workspace to group related tasks. Every task must belong to a Project.

* **Purpose:** To separate different areas of work or life. For example, "Personal Goals," "Novel Writing," or "Client X Website."
* **Properties:**
    * `Title`: The name of the project.
    * `Description`: An optional field for more detailed notes about the project's goals.

### 6.2 Task

The **Task** is the fundamental unit of work in SelfMade. It represents a specific, actionable item that needs to be completed.

* **Purpose:** To track individual to-do items, steps in a process, or any piece of work.
* **Hierarchy:** Tasks live within a Project.

### 6.3 Object Hierarchy: Infinite Nesting

The relationship between these objects is straightforward but powerful:

* A **Project** is a container for **Tasks**.
* A **Task** can exist on its own within a project (a top-level task).
* Crucially, a **Task** can also be a parent to other **Tasks**. This allows for infinite nesting of sub-tasks.

This creates a tree-like structure within each Project, enabling users to break down large, complex tasks into smaller, more manageable steps without any arbitrary limits.

**Example Structure:**

    Project: "Home Renovation"
    └── Task: "Renovate Kitchen"
    ├── Task: "Phase 1: Design"
    │   ├── Task: "Measure space"
    │   └── Task: "Hire designer"
    │       └── Task: "Interview Designer A"
    └── Task: "Phase 2: Demolition"
    ├── Task: "Remove old cabinets"
    └── Task: "Tear up flooring"

## 7.0 Task Fields & Properties

Every **Task** object within SelfMade has a set of default fields to describe and organize it. These properties are the core attributes for defining a piece of work.

    | Field Name  | Type        | Description                                                                          | Notes                                                                                                    |
    | :---------- | :---------- | :----------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------- |
    | **Title** | Small Text  | A short, clear name for the task.                                                    | This is the only mandatory field for creating a task.                                                    |
    | **Description** | Large Text  | A detailed description of the task, including any relevant notes, links, or context. | This field supports **Markdown** for rich text formatting (e.g., bold, italics, lists, headers).         |
    | **StartDate** | Date        | The date on which the task is planned to begin.                                      | Optional. Useful for planning and for the Calendar View.                                                 |
    | **EndDate** | Date        | The date on which the task is due to be completed.                                   | Optional. Used for deadlines and Calendar View.                                                          |
    | **Priority** | Dropdown    | The level of importance assigned to the task.                                        | Default options: `Low`, `Medium`, `High`, `Urgent`.                                                      |
    | **Status** | Dropdown    | The current state of the task within its workflow.                                   | The default statuses are `To Do`, `In Progress`, and `Done`. This field is customizable (see Key Features). |

## 8.0 Key Features

Beyond the basic structure of projects and tasks, SelfMade offers several key features designed to give the user maximum control over their workflow and data organization.

### 8.1 Custom Workflows (Status)

While SelfMade provides a default set of statuses (`To Do`, `In Progress`, `Done`), users are not restricted to this simple workflow. Users can define their own custom set of statuses on a per-project basis.

* **Functionality:** A user can create, edit, rename, and reorder status columns within a project.
* **Use Case:** This allows the workflow to perfectly match the user's process. For example:
    * An artist might use: `Idea` → `Sketching` → `Inking` → `Coloring` → `Complete`.
    * A writer might use: `Outline` → `First Draft` → `Revising` → `Final Edit`.
    * A student might use: `Assigned` → `Researching` → `Writing` → `Submitted`.

### 8.2 Custom Tags

Tags provide a flexible, secondary layer of organization that works across different projects. A tag is a label that can be added to any task to categorize, group, or filter it.

* **Functionality:**
    * Users can create any tag on the fly (e.g., `#errand`, `#urgent`, `#client-meeting`).
    * A single task can have multiple tags assigned to it.
    * Users can filter their task lists to see all tasks with a specific tag, regardless of which project they are in.
* **Use Case:** This is perfect for grouping tasks by context. A user could view all tasks tagged `#phone-call` to see every call they need to make, whether it's for work, a personal project, or home life.

### 8.3 Custom Fields

Custom Fields are the most powerful tool for personalization, allowing users to add their own unique data fields to tasks. This transforms a simple task into a rich data object tailored to the user's needs. Custom Fields can be created on a per-project basis.

* **Functionality:** A user can add a field by giving it a name and selecting a type. The following field types are supported:
    * **Number:** For tracking any numerical data, such as hours, cost, word count, or quantity.
    * **Small Text:** A single line of text, ideal for IDs, contact info, or short labels.
    * **Large Text:** A multi-line text area for extended notes or content. This field supports **Markdown**.
    * **Dropdown:** A user-defined list of options that can be selected. Perfect for creating custom categories like `Expense Type` or `Effort Level`.
    * **Checkbox:** A simple true/false toggle, ideal for tracking binary states like `Approved?` or `Requires Follow-up?`.

## 9.0 Views

Views are the different lenses through which a user can see their tasks. SelfMade will launch with two essential views designed for structured management and time-based planning.

### 9.1 To Do View (List View)

This is the primary and default view for interacting with tasks. It presents tasks in a clean, hierarchical list format, making it easy to see the structure of a project at a glance.

* **Layout:** The view displays tasks nested under their parent tasks, clearly showing the breakdown of complex items as outlined in the "Infinite Nesting" hierarchy.
* **Functionality:** This view is optimized for creating, editing, and organizing tasks. Users can see key details like Priority, Status, and End Date directly in the list. It will support robust sorting and filtering based on any task property, including status, priority, tags, and custom fields.
* **Purpose:** This view is for detailed project management, structural organization, and focused work sessions.

### 9.2 Calendar View

The Calendar View provides a time-centric visualization of tasks, helping users understand their schedule and manage deadlines effectively.

* **Layout:** A standard monthly or weekly calendar grid.
* **Functionality:**
    * Any task with an `EndDate` will appear on the calendar on its due date.
    * Any task with both a `StartDate` and `EndDate` will be displayed as an event block spanning those dates.
* **Purpose:** This view is ideal for weekly planning, visualizing workload over time, and ensuring that deadlines are not missed. It offers a crucial temporal context that a simple list cannot provide.