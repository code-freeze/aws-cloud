import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Car, cars as cars_list } from './cars';

(async () => {
  let cars:Car[]  = cars_list;

  //Create an express applicaiton
  const app = express(); 
  //default port to listen
  const port = 8082; 
  
  //use middleware so post bodies 
  //are accessable as req.body.{{variable}}
  app.use(bodyParser.json()); 

  // Root URI call
  app.get( "/", ( req: Request, res: Response ) => {
    res.status(200).send("Welcome to the Cloud!");
  } );


  // Get a greeting to a specific person 
  // to demonstrate routing parameters
  // > try it {{host}}/persons/:the_name
  app.get( "/persons/:name", 
    ( req: Request, res: Response ) => {
      let { name } = req.params;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Get a greeting to a specific person to demonstrate req.query
  // > try it {{host}}/persons?name=the_name
  app.get( "/persons/", ( req: Request, res: Response ) => {
    let { name } = req.query;

    if ( !name ) {
      return res.status(400)
                .send(`name is required`);
    }

    return res.status(200)
              .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Post a greeting to a specific person
  // to demonstrate req.body
  // > try it by posting {"name": "the_name" } as 
  // an application/json body to {{host}}/persons
  app.post( "/persons", 
    async ( req: Request, res: Response ) => {

      const { name } = req.body;
      console.log(req.body);

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // @TODO Add an endpoint to GET a list of cars

  // app.get("/cars", (req: Request, res: Response) => { 
  //   return res.status(200).send(cars);
  // })

  // app.get("/cars",( req: Request, res: Response) =>{
  //   return res.status(200).send(cars);

  // }
  // );
  // it should be filterable by make with a query paramater


//   app.get("/cars/:name", (req: Request, res: Response) =>{
//     let {name} = req.params;
//     console.log(name);

//     var i;
//     var myList = new Array();
//     for (i = 0; i < cars.length; i++)
//   {
//     if (cars[i].make == name )
//     {
//       myList.push(cars[i]);
//     }
//   }  

//   if (myList.length)
//   { 
//     return res.status(200).send(myList)
//   }
//   else 
//   {
//     return res.status(400).send("No name found");
//   }
// })
//   app.get("/cars/:name",( req: Request, res: Response) =>{
//     let {name} = req.params;
//     var i;
//     var myList = new Array();
//     for (i = 0; i < cars.length; i++) 
//     {
//         if (cars[i].make ==name)
//         {
//           myList.push(cars[i])

//         }
//     }
//     if (myList.length)
//       return res.status(200)
//                   .send(myList);
//     else
//       return res.status(404)
//                 .send(`No car of the make  ${name} found!`);
//   }
// );



app.get("/cars/",( req: Request, res: Response) =>{
  let {make} = req.query;

  // let cars_list=cars;
  if (make){
    const cars_list=cars.filter((car) => car.make==make);
    return res.status(200).send(cars_list);
  }
  return res.status(404).send("Please send a make");


});

  // @TODO Add an endpoint to get a specific car
  // it should require id
  // it should fail gracefully if no matching car is found
  app.get("/cars/:id",( req: Request, res: Response) =>{
    let {id} = req.params;
  
    
    if(!id){
      return res.status(404).send("Please provide an id")
    }
  
    var id1=parseInt(id);
    var car=cars.filter((car)=> car.id == id1);
console.log(typeof car);
     if(car && car.length==0)
     {
      return res.status(404).send("No id found")
     }
  return res.status(200).send(car);
  });



  /// @TODO Add an endpoint to post a new car to our list
  // it should require id, type, model, and cost
  app.post('/cars',(req: Request, res: Response) => {
    const { name } = req.body;
    var l_id=cars.slice(-1)[0].id;
    // console.log(l_id);
    let {make,type,model,cost,id}=req.body;
    if (!id || !type || !model || !cost ||!make)
    { 
      return res.status(400)
      .send(`{make:'var',type:'var',model:'var',cost:'int_var'}`);
    }

    const new_car :Car = {
      make:make,type:type,model:model,cost:cost,id:id
    };
    cars.push(new_car);
    return res.status(200)
              .send(new_car);

  });

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();