//class and object
//4 topics
//abstraction, encapsulation, inheritance and polymerphism
//class object
//class is a data structure provided to indicate./define the data ight be phuysically
//or virtuallly resembling some entity
//By using prototype
//By using class sturcutre

//Prototype based OOP
// function User(_name) {
//   //functional constructure
//   this.name = _name;
// }

// const user = new User("Sanjog Lama");
// // console.log(user);

// //abstract no any defined structure
// function Animal(_name) {
//   this.name = _name;
// }

// Animal.prototype.setSound = function (_sound) {
//   this.sound = _sound;
// };

// const dog = new Animal("Dog");
// dog.setSound("bark");
// console.log(dog);

// //2015 vanda aagadi ko lagi ES5 ani tespachi ES6

// class UserClass {
//   //data, functions
//   name = "";
//   email = "";
//   address = "Kathmandu";

//   //default function
//   constructor() {
//     //auto called when the object of this class is being made
//   }
// }

class User {
  name;
  email;
  address;
  status;
  image;
  constructor() {
    console.log("I am in user.");
  }
}

class Admin extends User {
  role;
  constructor() {
    super();
    console.log("I am in admin.");
  }
}

const adminObj = new Admin();
//constructor override garni tarika
