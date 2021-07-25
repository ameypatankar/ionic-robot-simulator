import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import constant from "./simulator.constant";
import { Direction, Command } from "./simulator.model";

@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.scss'],
})
export class SimulatorComponent implements OnInit {
  @ViewChild('output') private commandContiner: ElementRef | undefined;
  commands: string[] = [];

  totalRows: number = constant.MAX_ROW;
  totalCols: number = constant.MAX_COL;

  currentRow: number | null = null;
  currentCol: number | null = null;
  direction: Direction | null = null;
  command: string = "";
  isDark: boolean = false;

  constructor(private alertCtrl: AlertController) { }

  ngOnInit() { }

  counter = (i: number) => new Array(i).fill(0).map((s, i) => i);
  reverseCounter = (i: number) => this.counter(i).reverse();
  isRoboVisible = (row: number, col: number) => row == this.currentRow && col == this.currentCol;

  getBoxClass(row: number, col: number) {
    if (row % 2 == 0 && col % 2 == 0) return 'even-box'
    if (row % 2 == 1 && col % 2 == 1) return 'even-box'
    return 'odd-box';
  }

  getRotation() {
    let rotate;
    switch (this.direction) {
      case Direction.EAST: rotate = 90; break;
      case Direction.SOUTH: rotate = 180; break;
      case Direction.WEST: rotate = 270; break;
      default: rotate = 0;
    }
    return rotate;
  }

  scrollToBottom(): void {
    if (this.commandContiner && this.commandContiner.nativeElement) {
      this.commandContiner.nativeElement.scrollTop = this.commandContiner.nativeElement.scrollHeight;
    }
  }

  resetCommand() {
    this.currentRow = this.currentCol = this.direction = null;
    this.commands = [];
  }

  runCommand(command: string) {
    let isValidCommand = true;
    if (command) {
      let value: string = command.toUpperCase().trim();
      let isRobotPlaced = this.currentRow != null && this.currentCol != null;
      if (isRobotPlaced) {
        switch (value) {
          case Command.MOVE: this.moveRobot(); break;
          case Command.LEFT: this.trunRobot(true); break;
          case Command.RIGHT: this.trunRobot(false); break;
          case Command.REPORT: this.showReport(); break;
          default: isValidCommand = this.initRobot(value);
        }
      } else {
        isValidCommand = this.initRobot(value);
      }

      if (isValidCommand) {
        this.commands = [...this.commands, command];
        this.command = "";
        this.scrollToBottom();
      } else {
        this.alertCtrl.create({
          header: "ALERT",
          subHeader: "Please enter valid command",
          buttons: [
            {text:'Dismiss', cssClass: 'p-btn'}
          ],
          cssClass: 'alertMsg',
        }).then(alert => alert.present());
      }
    }
  }

  private initRobot(value: string) {
    let isValidCommand = true;
    let directions = [Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST];
    let values = value.split(" "); // PLACE 10 10 NORTH
    if (values.length > 3) {
      let direction = directions.find(s => s == values[3]);
      let row = this.toNumber(values[1]);
      let col = this.toNumber(values[2]);
      if (values[0] == Command.PLACE && direction && row != null && col != null) {
        if (row <= this.totalRows && col <= this.totalCols) {
          this.direction = direction;
          this.currentRow = row;
          this.currentCol = col;
        }
        else{
          isValidCommand = false;
        }
      } else {
        isValidCommand = false;
      }
    }
    else {
      isValidCommand = false;
    }
    return isValidCommand;
  }

  private moveRobot() {
    if (this.direction == Direction.NORTH) this.moveRobotRowCol(1, 0);
    if (this.direction == Direction.SOUTH) this.moveRobotRowCol(-1, 0);
    if (this.direction == Direction.EAST) this.moveRobotRowCol(0, 1);
    if (this.direction == Direction.WEST) this.moveRobotRowCol(0, -1);
  }

  private moveRobotRowCol(addrow: number, addcol: number) {
    if (addrow != 0 && this.currentRow != null && this.currentRow + addrow < this.totalRows && this.currentRow + addrow >= 0) {
      this.currentRow += addrow;
      return true;
    }

    if (addcol != 0 && this.currentCol != null && this.currentCol + addcol < this.totalCols && this.currentCol + addcol >= 0) {
      this.currentCol += addcol
      return true;
    }

    this.alertCtrl.create({
      header: "ALERT",
      subHeader: "The robot may fall. Please change the direction.",
      buttons: [
        {text:'Dismiss', cssClass: 'p-btn'}
      ],
      cssClass: 'alertMsg',
    }).then(alert => alert.present());
    return false;
  }

  private trunRobot(isLeft = true) {
    let direction = [Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST];
    let index = direction.findIndex(s => s == this.direction);
    index += isLeft ? -1 : 1;
    if (index == -1) this.direction = Direction.WEST;
    else if (index >= direction.length) this.direction = Direction.NORTH;
    else this.direction = direction[index];
  }

  private showReport() {
    this.alertCtrl.create({
      header: "REPORT",
      subHeader: ` Current Position: ${this.currentRow} ${this.currentCol} ${this.direction}`,
      buttons: [
        {text:'Dismiss', cssClass: 'p-btn'}
      ],
      cssClass: 'reportMsg',
    }).then(alert => alert.present());
  }

  private toNumber(value: string) {
    return isNaN(parseInt(value)) ? null : parseInt(value);
  }

  toggleTheme(event) {
    if(event.detail.checked) {
      document.body.setAttribute('color-theme', 'dark');
      this.isDark = true;
    }else {
      document.body.setAttribute('color-theme', 'light')
      this.isDark = false;
    }
  }
}
