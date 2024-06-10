import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { Observable, exhaustMap, of, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../Model/User';
import { NgForm } from '@angular/forms';
import { TaskService } from '../Services/tasks.service';
import { Task } from '../Model/Task';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  showCreateTaskForm: boolean = false;
  showEditTaskForm: boolean = false;
  currentTaskId: string = '';
  selectedTask: Task | undefined;

  tasks: Task[] = [];
  toDo!: string;
  constructor(
    private authService: AuthService,

    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.FetchTasks();
  }

  handleCreateTask(task: Task) {
    // Retrieve the current user from AuthService
    this.authService.user.pipe(take(1)).subscribe((user) => {
      if (user) {
        // Assign the user's full name to the createdBy property of the task
        task.author = user.email; // Ensure user.fullName is defined
        console.log('Received task data:', task);
        // Call createTask with the updated task object
        this.taskService.createTask(task).subscribe({
          next: () => {
            console.log('Task created successfully');
            // Optionally refresh the task list or perform other actions
            this.FetchTasks();
          },
          error: (err) => console.error('Error creating task:', err),
        });
      }
    });
  }

  FetchTasks() {
    this.taskService.getAlltasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        console.log('Tasks:', this.tasks);
      },
      error: (err) => console.error('Error:', err),
    });
  }

  openCreateTask() {
    this.showCreateTaskForm = true;
  }
  CloseCreateTaskForm() {
    // this.showCreateTaskForm = false;
  }

  OnEditTaskClicked(id: string | undefined) {
    if (id) {
      this.currentTaskId = id;
      // this.showEditTaskForm = true;

      this.selectedTask = this.tasks.find((task) => {
        task.id === id;
      });
      this.router.navigate(['EditTask', id]);
    }
  }

  // getAllTasks() {
  //   // take operator will take the latest limited value and it will automatically unsubscribe from this user BehaviorSubject - take operator returns usersubject
  //   //exhaustMap it simply waits for the first observable to compolete(which is take operator doing) and after that it takes the result of that observable (user object) and then this exhaustMap can return a new observable, it will replace observable in this entire observable chain
  //   this.taskService.getAlltasks().subscribe({
  //     next: (tasks: any[]) => {
  //       this.tasks = tasks;
  //       // this.isLoading = false;
  //     },
  //     // error: (error) => {
  //     //   this.setErrorMessage(error);
  //     // },
  //   });
  // }
  //   getAllTasks() {
  //     this.http
  //       .get<any>(
  //         'https://registrationform-87b3e-default-rtdb.firebaseio.com/tasks.json'
  //       )
  //       .subscribe((response: any) => {
  //         // Convert the object into an array
  //         this.tasks = Object.keys(response).map((key) => response[key]);
  //       });
  //   }
}
