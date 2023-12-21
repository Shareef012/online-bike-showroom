// app.js
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;
let emailadd='';
let pass='';
let html1='';
let username='';
mongoose.connect("mongodb://127.0.0.1:27017/pavan_75", { useNewUrlParser: true, useUnifiedTopology: true })
const con = mongoose.connection
const registrationSchema = new mongoose.Schema({
  name:String,
  email: String,
  phone:String,
  password: String,
});

const review= new mongoose.Schema({
  name:String,
  email:String,
  rate:Number,
  feedback:String,
});
//teseride
const testride= new mongoose.Schema({
  name:String,
  phone:Number,
  email:String,
  modelname:String,
  date:Date,
});

// booking form
const booking= new mongoose.Schema({
  name:String,
  phone:Number,
  email:String,
  modelname:String,
  date:Date,
  Address:String,
});
// Create a mongoose model using the schema
const registrations = mongoose.model('registrations', registrationSchema);
const reviews = mongoose.model('review', review);
const testrides = mongoose.model('testrides', testride);
const bookings = mongoose.model('bookings', booking);




// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));


app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname, '/public/home.html'));

 });
 app.get('/home',(req,res)=>{
  res.sendFile(path.join(__dirname, '/public/homeafterlogin.html'));

 });

// SIGNUP PAGE 
app.post('/signup', (req, res) => {
  const { name,email,ph, password ,repassword} = req.body;
  console.log(name,email,ph, password ,repassword)
     if(password!=repassword && repassword!='')
     {
      const errorMessage = 'Passwords does not match!';
      return res.status(400).send(`
          <script>
              alert("${errorMessage}");
              window.location.href = "/loginpageformst.html"; // Redirect to the same page
          </script>
      `);
     }
     else{
      var data = {
          "name":name,
          "email": email,
          "phone":ph,
          "password":password,
      }
  con.collection('registrations').insertOne(data,function(err, collection){
          if (err) throw err;
          const errorMessage = 'Registration Done Successfully!';
          return res.status(400).send(`
              <script>
                  alert("${errorMessage}");
                  window.location.href = "/loginpageformst.html"; // Redirect to the same page
              </script>
          `);
          console.log("Record inserted Successfully");
               
      });
     }
  });

 //Login 

  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    emailadd=email;
    pass=password
    console.log('user enter data');
    console.log(email);
    console.log(password);
    try {
      const registration = await registrations.findOne({email});
      username=registration.name;
       if(!registration)
          {
            const errorMessage = 'Your Email is Not found ';
          return res.status(400).send(`
          <script>
              alert("${errorMessage}");
              window.location.href = "/loginpageformst.html"; // Redirect to the same page
          </script>
      `);
          }
      else{
        
        const em =registration.email;
        const pass=registration.password;
        if(em==email && pass==password){
          res.redirect('/home');
        }
        else{
          const errorMessage = 'Inavlid password';
          return res.status(400).send(`
          <script>
              alert("${errorMessage}");
              window.location.href = "/loginpageformst.html"; // Redirect to the same page
          </script>
      `);
        }
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


//update password
app.post('/forgot', async (req, res) => {
  const { email,newPassword,repassword} = req.body;
  console.log(email, newPassword ,repassword);
     if(newPassword!=repassword && repassword!=' ')
     {
      const errorMessage = 'Passwords does not match!';
      return res.status(400).send(`
          <script>
              alert("${errorMessage}");
              window.location.href = "/loginpageformst.html"; // Redirect to the same page
          </script>
      `);
     }
else{
  try {
    const user = await registrations.findOne({ email });

    if (!user) {
      const errorMessage = 'User not found';
      return res.status(400).send(`
        <script>
          alert("${errorMessage}");
          window.location.href = "/loginpageformst.html"; // Redirect to the same page
        </script>
      `);
    }

    user.password = newPassword;

    await user.save();

    const successMessage = 'Password updated successfully!';
    return res.status(200).send(`
      <script>
        alert("${successMessage}");
        window.location.href = "/loginpageformst.html"; // Redirect to the same page
      </script>
    `);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
});

//delete
app.get('/delete', async (req, res) => {

  try {
    console.log(emailadd);
    console.log(pass);
    const user = await registrations.findOneAndDelete({ email: emailadd,password:pass});

    if (!user) {
      // User not found
      const errorMessage = 'Please Login ';
      return res.status(400).send(`
          <script>
              alert("${errorMessage}");
              window.location.href = "/loginpageformst.html"; // Redirect to the same page
          </script>
      `);
    }
  else{
    const errorMessage = 'Account delete succesfully!';
    emailadd='';
    pass='';
    return res.status(400).send(`
        <script>
            alert("${errorMessage}");
            window.location.href = "/"; // Redirect to the same page
        </script>
    `);
  }
  } catch (error) {
    // Handle errors
    return res.status(500).json({ message: 'Internal Server Error' });
  }

});

//review
app.post('/review', (req, res) => {
  if(emailadd ==''){
    const errorMessage = 'Please Login First';
    return res.status(400).send(`
    <script>
        alert("${errorMessage}");
        window.location.href = "/loginpageformst.html"; // Redirect to the same page
    </script>
`);
  }
  else{
  const {name,email,rate,feedback} = req.body;
   console.log(name,email,rate,feedback);
   var data = {
    "name": name,
    "email":email,
    "rate":rate,
    "feedback":feedback
}
   con.collection('reviews').insertOne(data,function(err, collection){
    if (err) throw err;
    const errorMessage = 'Thankyou for your review!';
    return res.status(400).send(`
        <script>
            alert("${errorMessage}");
            window.location.href = "/home"; // Redirect to the same page
        </script>
    `);
         
  });
}
  });
 
//testride
app.post('/testride', (req, res) => {
  if(emailadd ==''){
    const errorMessage = 'Please Login First';
    return res.status(400).send(`
    <script>
        alert("${errorMessage}");
        window.location.href = "/loginpageformst.html"; // Redirect to the same page
    </script>
`);
  }
  else{
  const {name,number,bike,date} = req.body;
   console.log(name,number,bike,date);
   var data = {
    "name":name,
    "phone":number,
    "email":emailadd,
    "modelname":bike,
    "date":date,
}
con.collection('testrides').insertOne(data,function(err, collection){
  if (err) throw err;
  const errorMessage = 'Appointment Done Successfully!';
  return res.status(400).send(`
      <script>
          alert("${errorMessage}");
          window.location.href = "/home"; // Redirect to the same page
      </script>
  `);
  console.log("Record inserted Successfully");
       
});
  }
});



//Booking
app.post('/booking', (req, res) => {
  if(emailadd ==''){
    const errorMessage = 'Please Login First';
    return res.status(400).send(`
    <script>
        alert("${errorMessage}");
        window.location.href = "/loginpageformst.html"; // Redirect to the same page
    </script>
`);
  }
  else{
  const {name,number,bike,date,addr} = req.body;
   console.log(name,number,bike,date,addr);
   var data = {
    "name":name,
    "phone":number,
    "email":emailadd,
    "modelname":bike,
    "date":date,
    "Address":addr,

}
con.collection('bookings').insertOne(data,function(err, collection){
  if (err) throw err;
  const errorMessage = 'Booking Done Successfully!';
  return res.status(400).send(`
      <script>
          alert("${errorMessage}");
          window.location.href = "/home"; // Redirect to the same page
      </script>
  `);
  console.log("Record inserted Successfully");
       
});
  }
});

//status
app.get('/loginstatus', (req, res) => {
  console.log(emailadd,pass)
   if(emailadd =='' && pass ==''){
        res.sendFile(path.join(__dirname, '/public/loginpageformst.html'));
   }
   else{
    const errorMessage = 'Already Login!';
       return res.status(400).send(`
           <script>
               alert("${errorMessage}");
               window.location.href = "/"; // Redirect to the same page
           </script>
       `);
   }
  });
  app.get('/signout', async (req, res) => {
    emailadd='';
    pass=''
    html1='';
    const errorMessage = 'Signout Successfully';
    return res.status(400).send(`
        <script>
            alert("${errorMessage}");
            window.location.href = "/"; // Redirect to the same page
        </script>
    `);
  });

//My bookings
app.get('/mybookings', async (req, res) => {
  if(emailadd=='')
  {
    const errorMessage = 'Please Login First';
    return res.status(400).send(`
    <script>
        alert("${errorMessage}");
        window.location.href = "/loginpageformst.html"; // Redirect to the same page
    </script>
`);
  }
  else{
  try {
    const userOrders = await bookings.find({ email: emailadd });
    // Render an HTML page with the table
    const tableRows = userOrders.map(bookings => {
      return `<tr>
                <td>${bookings.name}</td>
                <td>${bookings.phone}</td>
                <td>${bookings.modelname}</td>
                <td>${bookings.date}</td>
                <td>${bookings.Address}</td>
              </tr>`;
    });
    const html = `
      <html>
        <head>
          <style>
            table {
              border-collapse: collapse;
              width: 100%;
            }
            th, td {
              border: 1px solid #dddddd;
              text-align: left;
              padding: 8px;
            }
          </style>
        </head>
        <body>
          <h2>Your Bookings ${username}</h2>
          <table>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>ModelName</th>
              <th>Date</th>
              <th>Address</th>
            </tr>
            ${tableRows.join('')}
          </table>
        </body>
      </html>
    `;
    // Send the HTML as the response
    res.send(html);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



