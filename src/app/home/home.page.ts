import { Component, OnInit, ViewChild } from '@angular/core';
import { BatuwaService } from '../batuwa.service';
import { Device } from '@capacitor/device';
import { AlertController, IonModal, ToastController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  message: any;
  batuwaList = [];
  isLoaded !: boolean;
  passKey: any;
  deviceId: any;
  isAuthenticate !: boolean;

  @ViewChild(IonModal) modal!: IonModal;
  messages = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  email !: string;
  username !: string;
  password !: string;
  notes !: string;
  isModalOpen = false;
  modalMetaInfo: any;
  searchData: any;
  constructor(
    private btService: BatuwaService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    
  }
  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    if(this.password && this.email) {
      const payload = {
        deviceId: this.deviceId,
        email: this.email,
        username: this.username,
        password: this.password,
        notes: this.notes
      }
      this.modal.dismiss(this.email, 'confirm');
      this.btService.add_to_batuw(payload).subscribe((resp: any) => {
        this.btService.get_batuw(this.deviceId).subscribe((res: any) => {
          this.batuwaList = res.batuwa_docs;
          this.message = null;
          this.isLoaded = true;
          this.isAuthenticate = true;
          this.modal.dismiss(this.email, 'confirm');
        })
      })
      
    } else {
      this.presentAlert("Email and Password Required")
    }
    

    
  }

  setOpen(isOpen: boolean, list?: any) {
    this.isModalOpen = isOpen;
    this.modalMetaInfo = {
      email: list.email,
      password: list.password,
      username: list.username,
      notes: list.notes
    }
 
    console.log(this.modalMetaInfo);
    
  }
  onWillDismiss(event: Event) {
   
  }
  ngOnInit(): void {
    this.isLoaded = false;
    const logDeviceInfo = async () => {
      const info = await Device.getId();
      this.deviceId = info.identifier;
      this.initiate(this.deviceId);
      this.isLoaded = true;
    };
    logDeviceInfo()

  }

  initiate(deviceId: string) {
    this.btService.deviceExist(deviceId).subscribe((isExist: any) => {
      if(isExist.status) {
        this.authenticate()
      } else {
        this.message = 'Invalid User';
        this.addPassKey()
      }
    })
  }

  async addPassKey() {
    const alert = await this.alertController.create({
      inputs: [
      {
          name: 'passkey',
          placeholder: 'Enter New Batuwa Password',
          type: 'text'
      }],    
      buttons: [
          {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                  console.log('Confirm Cancel');
              }
          }, 
          {
              text: 'Ok',
              handler: (alertData) => { //takes the data 
                if(alertData.passkey) {
                  this.btService.add_to_passKey({deviceId: this.deviceId, passkey: alertData.passkey}).subscribe((res: any) => {
                    this.presentAlert('Password Added!!!')
                    this.initiate(this.deviceId);
                  })
                }
              }
          }
      ]
  });
  await alert.present();
  }


  async authenticate() {
    this.isAuthenticate = false;
    const alert = await this.alertController.create({
      inputs: [
      {
          name: 'passkey',
          placeholder: 'Enter Your Batuwa Password',
          type: 'text'
      }],    
      buttons: [
          {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                  console.log('Confirm Cancel');
              }
          }, 
          {
              text: 'Ok',
              handler: (alertData) => { //takes the data 
                this.btService.auth_batuwa(this.deviceId, alertData.passkey).subscribe((isauth: any) => {
                  if(isauth.authenticate) {
                    this.btService.get_batuw(this.deviceId).subscribe((res: any) => {
                      if(res && res.message) {
                        this.message = res.message;
                      } else {
                        this.batuwaList = res.batuwa_docs;
                      }
                      this.isLoaded = true;
                      this.isAuthenticate = true;
                    })
                  } else {
                    this.presentAlert('Invalid Password, Please Try Again')
                    this.authenticate()
                  }
                })
               
              }
          }
      ]
  });
  await alert.present();
  }

  async presentAlert(msg: string) {
    const alert = await this.toastController.create({
      message: msg,
      position: 'bottom',
      color: 'dark',
      duration: 3000      
    });
    await alert.present();
  }
}
