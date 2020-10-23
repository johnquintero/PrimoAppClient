/**
 * Imports
 */
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UIAlertService } from '../UITools/uialert.service';
import { UserService } from '../services/user/user.service';
import { User } from '../models/user';
import { GarajeService } from '../services/garaje/garaje.service';
import { SessionManagerService } from '../services/user/session-manager.service';

/**
 * Esta clase maneja todos los eventos de la pagina de Login
 */
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  /** Atributos de Clase **/
  @ViewChild('usernameInput') usernameInput;
  @ViewChild('passwordInput') passwordInput;
  @ViewChild('usernameItem') usernameItem;
  @ViewChild('passwordItem') passwordItem;

  user: User;

  /**
   * Metodo Constructor
   * @param alert 
   * @param router 
   */
  constructor(public alert : UIAlertService,
              public router: Router,
              public userService: UserService,
              public garajeService : GarajeService,
              public session : SessionManagerService) {}
            
  /**
   * Método que valida el campo de Nombre de Usuario
   * @param username 
   */
  validateUsername(username: string): boolean{
    if(username.length!=0 && (!username.includes("@") || !username.includes(".com"))){
      this.usernameItem.color="danger";
      this.usernameInput.setFocus();
      this.alert.putMsgError('El formato del nombre de usuario no es valido. Verifique e intente nuevamente');
      return false;
    }
    else if(username.length==0){
      this.usernameItem.color="danger";
      this.usernameInput.setFocus();
      this.alert.putMsgError('El campo usuario no puede estar vacio.');
      return false;
    }
    else{
      this.usernameItem.color="ligth";
    }
    return true;
  }

  /** 
   * Método que valida el campo de Nombre de la contraseña
   * @param password 
   */
  validatePassword(password: string): boolean{
    if(password.length==0){
      this.passwordItem.color="danger";
      this.passwordInput.setFocus();
      this.alert.putMsgError('El campo contraseña no puede estar vacio.');
      return false;
    }
    return true;
  }

  /**
   * Método que se encarga de autenticar un cliente
   * @param username 
   * @param password 
   */
  login(username : string, password : string){
    if(this.validateUsername(username) && this.validatePassword(password)){
      this.userService.getUser(username, password).subscribe(data=>{
        this.session.user_in_session=data;
        this.doLogin();
      });
    }
  }

  /**
   * Método que se encarga de colocar el usuario en sesión
   */
  private doLogin(){
    this.returnToNormality();
    if(!this.session.user_in_session){
      this.alert.putMsgError("El usuario y/o contraseña no son válidos. Verifique e intente nuevamente");
    }
    else{
      this.router.navigate(['/dashboard']);
    }
  }

  /**
   * Método privado que se encarga de dejar todo en el estado incial
   */
  private returnToNormality(){
    this.usernameInput.value="";
    this.passwordInput.value="";
    this.usernameItem.color="ligth";
    this.passwordItem.color="ligth";
  }

  getGarajeUsuario(){
    this.garajeService.getGarajeUsuario(3).subscribe(data => {
      console.log(data);
    },
    err => console.log(err));
  }

  getVehiculo(){
    this.garajeService.getVehiculo(1).subscribe(data => {
      console.log(data);
    },
    err => console.log('Se presento un error',err),
    () => console.log('Esta vacio'))
  }

}
