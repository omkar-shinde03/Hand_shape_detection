let faceMesh;
let handPose;
let bodyPose;
let bodys = [];
let hands = [];
let face = [];

let cam;
let w = 640;
let h = 480;
let camW = 640;
let camH = 480;

function preload() {
  let optionsForfaceMesh = {
    maxFace: 2,
  };
  faceMesh = ml5.faceMesh(optionsForfaceMesh);

  let optionsForHandPose = {
    maxHands: 2,
  };
  handPose = ml5.handPose(optionsForHandPose);

  let optionsForBodyPose = {
    maxHands: 2,
  };
  bodyPose = ml5.bodyPose({ flipped: true }, optionsForBodyPose);
}

function setup() {
  createCanvas(w, h);

  //camera related

  cam = createCapture(VIDEO, { flipped: true }, camReady);
  cam.size(camW, camH);
  cam.hide();
}

function draw() {
  background(220);
  image(cam, 0, 0, camW, camH);


let mouth_open = false


// to solve the overlaping of shape deection ... im tryijng 
let its_rectangle = false
let its_triangle = false
let its_circle = false

    //  for face
  fill(255, 0, 255);
  if (face.length > 0) {
    for (let j = 0; j < face.length; j++) {
      let faceKeyPoints = face[j].keypoints;
      for (let i = 0; i < faceKeyPoints.length; i++) {
        let upperlip = faceKeyPoints[13];
        let lowerlip = faceKeyPoints[14];
        circle(faceKeyPoints[i].x, faceKeyPoints[i].y, 2, 2);
          if (dist(upperlip.x,upperlip.y,lowerlip.x,lowerlip.y) > 5){
            mouth_open = true
        }
      }
    }
  }



    // for bodyy
  fill(255, 255, 0);
  if (bodys.length > 0) {
    for (let j = 0; j < bodys.length; j++) {
      let bodyKeyPoints = bodys[j].keypoints;
      for (let i = 0; i < bodyKeyPoints.length; i++) {
        circle(bodyKeyPoints[i].x, bodyKeyPoints[i].y, 5, 5);
      }
    }
  }





  // for hands

  if (hands.length > 0) {
    for (let j = 0; j < hands.length; j++) {
      let handKeyPoints = hands[j].keypoints;
      for (let i = 0; i < handKeyPoints.length; i++) {
        if (hands[j].handedness == "Right") {
          fill(0, 0, 0);
        }
        if (hands[j].handedness == "Left") {
          fill(255, 255, 255);
        }
        ellipse(handKeyPoints[i].x, handKeyPoints[i].y, 7, 7);
      }
    }
  }
  



 // to chek if the left thumb and right index finger are close to each other and right thumb and left index finger are close to each other
  fill(0, 0, 0);
  if (hands.length === 2) {
    let hand1 = hands[0];
    let hand2 = hands[1];

    let righthand = hand1.handedness === "Right" ? hand1 : hand2;
    let lefthand = hand1.handedness === "Left" ? hand1 : hand2;

    let l_t = lefthand.keypoints[4];
    let r_i = righthand.keypoints[8];
    let l_i = lefthand.keypoints[8];
    let r_t = righthand.keypoints[4];

    let d1 = dist(l_t.x, l_t.y, r_i.x, r_i.y);
    let d2 = dist(l_i.x, l_i.y, r_t.x, r_t.y);




    //  for RECTANGLE BOSS
    if (d1 < 50 && d2 < 50 && mouth_open === true && its_circle === false && its_triangle === false) {
      its_rectangle = true
      its_triangle = false
      its_circle = false
      text("It's a RECTANGLE BOSS", 20, 100);
    }


    // for TRIANGLE BOSS
    if (dist(l_t.x, l_t.y, r_t.x, r_t.y) < 50 && dist(l_i.x, l_i.y, r_i.x, r_i.y) < 50 &&  mouth_open === true && its_circle === false && its_rectangle === false) {
      its_triangle = true
      its_rectangle = false
      its_circle = false
      text("It's a TRIANGLE BOSS", 20, 100);
    }



    // for CIRCLE boss             // its the hardest work and logest work session i ever had ...

    let l_t_tip = lefthand.keypoints[4];
    let l_t_bip = lefthand.keypoints[3];
    let l_t_bamm = lefthand.keypoints[2];
    let l_t_bapp = lefthand.keypoints[1];
    let l_t_deep = lefthand.keypoints[0];

    let r_t_tip = righthand.keypoints[4];
    let r_t_bip = righthand.keypoints[3];
    let r_t_bamm = righthand.keypoints[2];
    let r_t_bapp = righthand.keypoints[1];
    let r_t_deep = righthand.keypoints[0];

    circle_dist_tip = dist(l_t_tip.x,l_t_tip.y,r_t_tip.x,r_t_tip.y)
    circle_dist_bip = dist(l_t_bip.x,l_t_bip.y,r_t_bip.x,r_t_bip.y)
    circle_dist_bamm = dist(l_t_bamm.x,l_t_bamm.y,r_t_bamm.x,r_t_bamm.y)
    circle_dist_bapp = dist(l_t_bapp.x,l_t_bapp.y,r_t_bapp.x,r_t_bapp.y)
    circle_dist_deep = dist(l_t_deep.x,l_t_deep.y,r_t_deep.x,r_t_deep.y)


    if (circle_dist_bamm < 100 && circle_dist_bapp < 100 && circle_dist_bip < 100 && circle_dist_deep <  100 && circle_dist_tip < 100 && mouth_open === true ){
      its_circle = true
      its_rectangle = false
      its_rectangle = false
      text("WOOOOOo,, I DId IT ,,,ITS A CIRCLE BOSSS",20,100)
    }

    //                 NOOOOOOOOOT WORKINGGGGGGGGGGGb

    // let lef_th_botom = lefthand.keypoints[1];
    // let rig_th_botokm = righthand.keypoints[1];
    // let left_wrist = lefthand.keypoints[0];
    // let right_wrist = righthand.keypoints[0];

    // let left_ldy_f_t = lefthand.keypoints[20];
    // let right_ldy_f_t = righthand.keypoints[20];


    // dist_wrist = dist(left_wrist.x,left_wrist.y,right_wrist.x,right_wrist.y)
    // dist_thum_botom = dist(lef_th_botom.x,lef_th_botom.y,rig_th_botokm.x,rig_th_botokm.y)
    // dist_ldy_fingr = dist(left_ldy_f_t.x,left_ldy_f_t.y,right_ldy_f_t.xx,right_ldy_f_t.y)



    // if (dist_wrist < 40 && dist_ldy_fingr < 40 && dist_thum_botom < 40 && mouth_open === true){
    //   text("WOOOOOo,, I DId IT ,,,ITS A CIRCLE BOSSS",20,100)
    // }


  }
}


// }

function camReady() {
  console.log("Camera is ready BOSS ");
  faceMesh.detectStart(cam, gotFace);
  handPose.detectStart(cam, gotHands);
  bodyPose.detectStart(cam, gotBody);
}

function gotFace(results, err) {
  if (err) {
    console.log("Some Error in Detectig Face");
  } else {
    face = results;
  }
}

function gotBody(results, err) {
  if (err) {
    console.log("Some Error in Detectig Body");
  } else {
    bodys = results;
  }
}

function gotHands(results, err) {
  if (err) {
    console.log("Some Error in Detectig Hands");
  } else {
    hands = results;
  }
}

function keyPressed() {
  if (key === "d" || key === "D") {
    console.log(JSON.stringify(hands));
    console.log(face);
    console.log(hands);
    console.log(bodys);
  }
}








