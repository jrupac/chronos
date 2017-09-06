# CRONOS - Tracker
---

## STRUCTURE

- [Project]
    - [Epic]
       -  [Task]

## TYPES

Member:
   - Id: int64
   - Name: string

Project:
   - Id: int64
   - Name: string
   - Description: string
   - Members: [Member]

Epic:
   - Id: int64
   - Name: string
   - ProjectId: int64
   - Active: bool

Task:
   - Id: int64
   - ProjectId: int64
   - EpicId: int64?
   - Title: string
   - Description: string
   - AssigneeId: int64
   - StateId: int64

State:
   - Id: int64
   - State: string
        - Defaults: [ BACKLOG, UNSTARTED, IN-PROGRESS, FINISHED, ARCHIVED, ... ]

## API

### States
```
AddState(state: string) -> (State, error)
EditState(state: State, opts...) -> (State, error)
GetStates() -> ([State], error)
DeleteState(state: State) -> error
```

### Members
```
AddMember(name: string) -> (Member, error)
EditMember(member: Member, opts...) -> (Member, error)
GetMembers() -> ([Member], error)
DeleteMember(member: Member) -> error
```

### Projects
```
CreateProject(name: string, description: string, members: [Member]) -> (Project, error)
EditProject(project: Project, opts...) -> (Project, error)
GetProjects() -> ([Project], error)
DeleteProject(project: Project) -> error
```

### Epics
```
CreateEpic(name: string, projectId: int64) -> (Epic, error)
EditEpic(epic: Epic, opts...) -> (Epic, error)
GetEpicsWithProject(projectId: int64) -> ([Epic], error)
MarkEpicActive(epic: Epic) -> (Epic, error)
MarkEpicInactive(epic: Epic) -> (Epic, error)
DeleteEpic(epic: Epic) -> error
```

### Tasks
```
AddTask(title: string, description: string, assignee: Member?, state: State [default=UNSTARTED], projectId: int64, epicId: int64?) -> (Task, error)
EditTask(task: Task, opts...) -> (Task, error)
GetTasksWithProject(projectId: int64) -> ([Task], error)
GetTasksWithEpic(epicId: int64) -> ([Task], error)
GetTasksWithState(state: State) -> ([Task], error)
GetTasksWithAssignee(member: Member) -> ([Task], error)
DeleteTask(task: Task) -> error
```
