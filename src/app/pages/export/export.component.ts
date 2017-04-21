import { Component } from '@angular/core';
import { ExportsService } from 'app/services/api/exports.service';
import { AppService } from "app/services/app.service";
import { ProjectsService } from "app/services/api/projects.service";

@Component({
  selector: 'export',
  templateUrl: 'export.html'
})
export class ExportComponent {

  public weeksToExport: number = 1;
  public monthsToExport: number = 0;
  public projectToExport: number = -1;

  public managedProjectItems = [{label: "<Select a project>", value: -1}];

  constructor(public app: AppService,
              private exportsService: ExportsService,
              private projectsService: ProjectsService) {}

  ngOnInit() {
      this.projectsService.getManagedProjects().then(projects => {
          projects.forEach(project => this.managedProjectItems.push(
             {label: project.name, value: project.id}
          ));
      })
  }

  export() {
    this.exportsService.getExcelForName(2);
  }
}
