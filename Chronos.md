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
   - Assignee: Member
   - State: State

State:
   - Id: int64
   - State: string
        - Defaults: [ BACKLOG, UNSTARTED, IN-PROGRESS, FINISHED, ARCHIVED, ... ]

## API

```
CreateMember(name: string) -> (Member, error)
EditMember(member: Member, opts...) -> (Member, error)
DeleteMember(member: Member) -> error

CreateProject(name: string, description: string, members: [Member]) -> (Project, error)
EditProject(project: Project, opts...) -> (Project, error)
ArchiveProject(project: Project) -> error
DeleteProject(project: Project) -> error

CreateEpic(name: string, projectId: int64) -> (Epic, error)
EditEpic(epic: Epic, opts...) -> (Epic, error)
MarkEpicActive(epic: Epic) -> (Epic, error)
MarkEpicInactive(epic: Epic) -> (Epic, error)
DeleteEpic(epic: Epic) -> error

CreateTask(title: string, description: string, assignee: Member?, state: State [default=UNSTARTED], projectId: int64, epicId: int64?) -> (Task, error)
EditTask(task: Task, opts...) -> (Task, error)
DeleteTask(task: Task) -> error

GetProjects() -> ([Project], error)

GetEpicsWithProject(projectId: int64) -> ([Epic], error)

GetTasksWithProject(projectId: int64) -> ([Task], error)
GetTasksWithEpic(epicId: int64) -> ([Task], error)
GetTasksWithState(state: State) -> ([Task], error)
GetTasksWithAssignee(member: Member) -> ([Task], error)
```
