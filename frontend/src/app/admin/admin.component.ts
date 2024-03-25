import { Component } from '@angular/core';
import { LoginservisService } from '../servisi/loginservis.service';
import { Nastavnik } from '../models/nastavnik';
import { Predmet } from '../models/predmet';
import { Router } from '@angular/router';
import { Cas } from '../models/cas';

import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartDataset,Chart,ChartOptions } from 'chart.js';
import { Ucenik } from '../models/ucenik';

class barChartSubject{
  subject : string = "";
  count : number = 0;
}
class barChartAge{
  age : string = "";
  count : number = 0;
}
class PieChartHelper{
  pol : string = "";
  count : number = 0;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  constructor(private servis :LoginservisService, private router : Router ){}
  backend: string = "http://localhost:4000"
  where : number = 2
  chart : number = 1
  ucenici : Ucenik[] = []
  nastavnici : Nastavnik[] = []
  predmeti : Predmet[] = []
  predmetiGOOD : Predmet[] = []
  casovi : Cas[] = []
  predmettoadd : string = ""
  ageGRP : string[] = ["srednja","osnovna5-8","osnovna1-4"]
  pol : string[] = ['M','Z']
  nastavniciGOOD : Nastavnik[] = []
  //BarDiagramSubjects
  public barChartType2: ChartType = 'bar';
  public barChartData2: ChartData<'bar'> = {
    labels: [],
    datasets: [

    ],
  };
  public chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  }
  subjectList : barChartSubject[] = []

  //BarDiagramSubjects
  public barChartDataAge: ChartData<'bar'> = {
    labels: [],
    datasets: [

    ],
  };
  ageList : barChartAge[] = []
  //PieChartNastavnici
  public pieType: ChartType = 'pie';
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [

    ],
  };
  nastavniciPol : PieChartHelper[] = []
  //PieChartUcenici
  public pieChartData2: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [

    ],
  };
  uceniciPol : PieChartHelper[] = []
  //HISTOGRAMCHART
  public histogramChart: ChartData<'bar', number[], string | string[]> = {
    labels: [],
    datasets: [

    ],
  };
  public histogramOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Percentage'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return context.dataset.label + ': ' + context.formattedValue;
            //return context.dataset.label + ': ' + context.formattedValue + '%';
          }
        }
      }
    }
  };
  //LINE CHART
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [

    ],
    labels: [],
  };
  public lineChartType: ChartType = 'line';
  public lineChartOptions: any  = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      y: {
        position: 'left',
      },
      y1: {
        position: 'right',
        grid: {
          color: 'rgba(255,0,0,0.3)',
        },
        ticks: {
          color: 'red',
        },
      },
    },
    plugins: {
      legend: { display: true },
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          scaleID: 'x',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            display: true,
            position: 'center',
            color: 'orange',
            content: 'LineAnno',
            font: {
              weight: 'bold',
            },
          },
        },
      ],
    },
  };


  changeWhere(b : number){
    this.where = b;
  }

  ngOnInit(){
    let logged = localStorage.getItem("admin")
    if(!logged){
      console.log("AM HERE")
      this.router.navigate(['login']);
    }
    this.servis.getAllNastavnik().subscribe(nastavnik=>{
      if(nastavnik){
        this.servis.getAllCasoviOdrzani().subscribe(casovi=>{
          if(casovi){

            this.createLineChart(nastavnik,casovi);
          }
        })
      }
    })
    this.servis.getAllCasoviOdrzani().subscribe(casovi=>{
      if(casovi){
        this.casovi = casovi;
        this.createHistogram();
      }

    })
    this.servis.getAllNastavnik().subscribe(rez=>{
        this.nastavniciGOOD = rez
    })
    this.servis.nastavnikwait().subscribe(rez =>{
       this.nastavnici = rez
    })
    this.servis.getpredmeti(0).subscribe(rez=>{
      this.predmeti = rez
    })
    this.servis.getpredmeti(1).subscribe(rez=>{
      this.predmetiGOOD = rez
    })
    //BarChart
    this.servis.getpredmeti(1).subscribe(rez=>{
      if(rez){
        this.servis.getAllNastavnik().subscribe(data=>{
          if(data){
            this.countBySubject(rez,data)
            this.countByAge(data)
            this.populateBarChartSubject()
          }

      })
      }
    })
    //Pie Chart
    this.servis.getAllUcenici().subscribe(uc=>{
      if(uc){
        this.servis.getAllNastavnik().subscribe(data=>{
          if(data){
            this.countPol(uc,data)
            this.populatePieChart()

          }

      })
      }
    })


  }

  prihvatiNastavnika(name : string){
    this.servis.potvrdinastavnikagain(name,1).subscribe(rez=>{

    })
    let nst = this.nastavnici.filter(dt => dt.username === name)

    for(let a of nst[0].razredi){
      let index = this.barChartDataAge.labels!.indexOf(a);
      if (index !== -1) {
        if (
          this.barChartDataAge.datasets[0].data[index] !== undefined &&
          this.barChartDataAge.datasets[0].data[index] !== null &&
          this.barChartDataAge.datasets[0] !== null
      ) {
          if (typeof this.barChartDataAge.datasets[0].data[index] === 'number') {
            let dataPoint = this.barChartDataAge.datasets[0].data[index] as number;
            this.barChartDataAge.datasets[0].data[index] = dataPoint + 1
          }
        }


      }
    }
    let index2 = this.pieChartData.labels!.indexOf(nst[0].sex);
    if(index2 !== -1){
      if(this.pieChartData.datasets[0].data[index2] !== undefined &&
        this.pieChartData.datasets[0].data[index2] !== null &&
        this.pieChartData.datasets[0] !== null){
          let dataPoint = this.pieChartData.datasets[0].data[index2] as number;
          this.pieChartData.datasets[0].data[index2] = dataPoint + 1

      }
    }

    this.nastavnici = this.nastavnici.filter(nastavnik => nastavnik.username !== name)


    //this.servis.nastavnikwait().subscribe(rez =>{
    //  this.nastavnici = rez
    //})
  }

  odbijNastavnika(name : string){
    this.servis.potvrdinastavnikagain(name,2).subscribe(rez=>{

    })
    this.nastavnici = this.nastavnici.filter(nastavnik => nastavnik.username !== name)
    //this.servis.nastavnikwait().subscribe(rez =>{
    //  this.nastavnici = rez
    //})
  }

  addPredmet(name : string){
    this.servis.potvrdipredmet(name,1).subscribe(rez=>{
      const newDataset :{data: number[], label:string} = {data:[], label:'Broj nastavnika po predmetu'}

      this.barChartData2.labels!.push(name)
      newDataset.data.push(0)
      this.barChartData2.datasets.push(newDataset)
    })
    this.predmeti = this.predmeti.filter(predmet => predmet.predmet !== name)

    //this.servis.getpredmeti(0).subscribe(rez=>{
    //  this.predmeti = rez
    //})
  }

  rejectPredmet(name : string){
    this.servis.potvrdipredmet(name,2).subscribe(rez=>{

    })
    this.predmeti = this.predmeti.filter(predmet => predmet.predmet !== name)
    //this.servis.getpredmeti(0).subscribe(rez=>{
    //  this.predmeti = rez
    //})
  }

  addPr(name : string){
    this.servis.addpredmeti(name,1).subscribe(rez=>{
      if(rez.message === "Dodat predmet"){
        const newDataset :{data: number[], label:string} = {data:[], label:'Broj nastavnika po predmetu'}

        this.barChartData2.labels!.push(name)
        newDataset.data.push(0)
        this.barChartData2.datasets.push(newDataset)
        alert("Predmet dodat")
      }
    })

    //this.ngOnInit()
  }


  LogOut(){
    localStorage.clear()
    this.router.navigate([''])
  }
  //BAR DIAGRAM FUNC
  countBySubject(pred: Predmet[],nast : Nastavnik[]){
    pred.forEach(subject=>{
      let count = nast.filter(teacher => teacher.predmeti.includes(subject.predmet)).length
      const hlp = new barChartSubject()
      hlp.count = count
      hlp.subject = subject.predmet
      this.subjectList.push(hlp)
    })
  }
  countByAge(nast : Nastavnik[]){
    this.ageGRP.forEach(age=>{
      let count = nast.filter(teacher => teacher.razredi.includes(age)).length
      const hlp = new barChartAge()
      hlp.count = count
      hlp.age = age
      this.ageList.push(hlp)
    })
  }

  populateBarChartSubject(){
    //Subject
    const newDataset: { data: number[], label: string } = { data: [], label: 'Broj nastavnika po predmetu' };
    if (!this.barChartData2.labels) {
      this.barChartData2.labels = [];
    }
    this.subjectList.forEach(data=>{
      if(this.barChartData2.labels){
        this.barChartData2.labels.push(data.subject)
      }
      newDataset.data.push(data.count)

    })
    this.barChartData2.datasets.push(newDataset)
    //Age
    const newDataset2: { data: number[], label: string } = { data: [], label: 'Broj nastavnika po razredima' };
    if (!this.barChartDataAge.labels) {
      this.barChartDataAge.labels = [];
    }
    this.ageList.forEach(ag =>{
      if(this.barChartDataAge.labels){
        this.barChartDataAge.labels.push(ag.age)
      }
      newDataset2.data.push(ag.count)
    })
    this.barChartDataAge.datasets.push(newDataset2)

    //this.barChartLabels.push(subjectData.subject);
    //this.barChartData.push({ data: [subjectData.teacherCount], label: subjectData.subject });
  }
  showChartBar(num : number){
    this.chart = num
  }
  //PIECHART
  countPol(u : Ucenik[],n: Nastavnik[]){

    this.pol.forEach(pl=>{
      let count = u.filter(ucenik=> ucenik.sex === pl).length
      let count2 = n.filter(nastavnik=> nastavnik.sex === pl).length
      let hlp = new PieChartHelper()
      hlp.pol = pl
      hlp.count = count
      this.uceniciPol.push(hlp)
      let hlp2 = new PieChartHelper()
      hlp2.count = count2
      hlp2.pol = pl
      this.nastavniciPol.push(hlp2)
    })
  }

  populatePieChart(){
    const newDataset: { data: number[], label: string } = { data: [], label: 'Nastavnici po polovima' };
    const newDataset2: { data: number[], label: string } = { data: [], label: 'Ucenici po polovima' };
    if(!this.pieChartData.labels){
      this.pieChartData.labels = []
    }
    if(!this.pieChartData2.labels){
      this.pieChartData2.labels = []
    }
    this.nastavniciPol.forEach(nastavnik=>{
      if(this.pieChartData.labels){
        this.pieChartData.labels.push(nastavnik.pol)
      }
      newDataset.data.push(nastavnik.count)
    })
    this.uceniciPol.forEach(ucenik=>{
      if(this.pieChartData2.labels){
        this.pieChartData2.labels.push(ucenik.pol)
      }
      newDataset2.data.push(ucenik.count)
    })
    this.pieChartData.datasets.push(newDataset)
    this.pieChartData2.datasets.push(newDataset2)
  }

  //HISTOGRAM
  createHistogram() {
    const daysOfWeek = ['NED', 'PON', 'UTO', 'SRE', 'ČET', 'PET', 'SUB'];

    // Count classes held on each day of the week
    const classesPerDay = Array.from({ length: 7 }, () => 0);
    this.casovi.forEach(cas => {
      let dayIndex = new Date(cas.datumvreme).getDay();
      let year = new Date(cas.datumvreme).getFullYear()
      if(year === 2023) {
        classesPerDay[dayIndex]++;
      }

    });
    daysOfWeek.forEach(dani=>{
      if( this.histogramChart.labels){
        this.histogramChart.labels.push(dani)
      }

    })


    let totalClasses = this.casovi.filter(cas => new Date(cas.datumvreme).getFullYear() === 2023).length


    const percentages = classesPerDay.map(count => (count / totalClasses) * 100);
    const newDataset: { data: number[], label: string } = { data: [], label: 'Broj casova po danima' };
    //percentages.forEach(procenti=>{
    //  newDataset.data.push(procenti)
    //})
    classesPerDay.forEach(procenti=>{
      newDataset.data.push(procenti)
    })
    this.histogramChart.datasets.push(newDataset)
  }


  createLineChart(nastavnici : Nastavnik[], casovi : Cas[]): void {
    //URADI KASNIJE I PROVERU DA MORA 2023 I URADI SORT TOP 10
    const classesPerTeacherPerMonth = new Map<string, number[]>();

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    months.forEach(mesec=>{
      if(this.lineChartData.labels){
        this.lineChartData.labels.push(mesec)
      }
    })
    nastavnici.forEach(nastavnik => {
      classesPerTeacherPerMonth.set(nastavnik.username, Array(12).fill(0));
    });
    casovi.forEach(cas => {
      const date = new Date(cas.datumvreme);

      if (classesPerTeacherPerMonth.has(cas.nastavnik) && date instanceof Date && date.getFullYear() === 2023) {
        const monthIndex = date.getMonth();
        const currentCount = classesPerTeacherPerMonth.get(cas.nastavnik)![monthIndex];
        classesPerTeacherPerMonth.get(cas.nastavnik)![monthIndex] = currentCount + 1;
      }
    });

     // Calculate total number of classes per teacher
    const totalClassesPerTeacher = new Map<string, number>();
    nastavnici.forEach(nastavnik => {
      const totalClasses = classesPerTeacherPerMonth.get(nastavnik.username)!.reduce((acc, val) => acc + val, 0);
      totalClassesPerTeacher.set(nastavnik.username, totalClasses);
    });

    // Sort teachers based on total number of classes
    const sortedTeachers = [...totalClassesPerTeacher.entries()].sort((a, b) => b[1] - a[1]);

    // Select top 10 teachers
    const top10Teachers = sortedTeachers.slice(0, 10);


    // Generate line chart data for top 10 teachers
    this.lineChartData.labels = months;
    this.lineChartData.datasets = top10Teachers.map(([teacher, _]) => {
      return {
        data: classesPerTeacherPerMonth.get(teacher)!,
        label: teacher,
        borderColor: this.getRandomColor()
      };
    });


    //nastavnici.forEach(nastavnik=>{
    //  const newDataset: { data: number[], label: string, borderColor: string } = { data: classesPerTeacherPerMonth.get(nastavnik.username)!,
     //   label: nastavnik.username, borderColor : this.getRandomColor() };
     // this.lineChartData.datasets.push(newDataset)
    //})




  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }


  openPdf(url : string) {
    window.open(this.backend + url, '_blank');

  }
}





