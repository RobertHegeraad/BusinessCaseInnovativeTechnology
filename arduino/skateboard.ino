// https://waime.wordpress.com/2015/03/15/basic-measurement-with-accelerometer-gy-61-with-adxl335-chip/

const int VCCPin = A4;
const int xPin   = A3;
const int yPin   = A2;
const int zPin   = A1;
const int GNDPin = A0;

int x = 0;
int y = 0;
int z = 0;

enum Flip {
  KICKFLIP = 0,
  HEELFLIP = 1
};

enum Spin {
  FRONTSIDE,
  BACKSIDE
};

enum Rotation {
  HALF,
  FULL
};

int previousY = 0;
int currentY = 0;

bool normalized = false;

int stepY = 60;
int margin = 10;

int direction = 0;

bool _0 = false;
bool _90 = false;
bool _180 = false;
bool _270 = false;
bool _360 = false;

void setup() {
  pinMode(A0, OUTPUT);
  pinMode(A4, OUTPUT);
  digitalWrite(18, HIGH);
  digitalWrite(14, LOW);

  Serial.begin(9600);
  Serial.println("setup");
}

void loop() {
  x = analogRead(xPin);
  y = analogRead(yPin);
  z = analogRead(zPin);

  // Normalize
  x -= 340;
  y -= 344;
  z -= 411;
//  
//  Serial.print(" x = ");
//  Serial.println(x);
//  Serial.print(" y = ");
//  Serial.print(y);
//  Serial.println(" ");
//  Serial.print("  z = ");
//  Serial.print(z);
//  Serial.println(" ");
  //Serial.print(" angle: ");
  //Serial.println(constrain(map(x,349,281,0,90),0,90));

  if(y < 0 + margin && y > 0 - margin) {
    normalized = true;
  }

  if(normalized) {
    getFlip(y);
  }
}

void getFlip(int y) {
  if(abs(y) > stepY + margin) {
    return;
  }

  if(direction == 0) {
    if(y < margin) {
      direction = 1;  // KICKFLIP 
    } else if(y > margin) {
      direction = 2;  // HEELFLIP
    }
  }

  y = abs(y);

  if(y < stepY + margin &&
     y > stepY - margin) {
      
    if(!_90) {
//      Serial.println("Rotation: 90");
    }
    _90 = true;
  }

  if(y > 0 &&
     y < margin &&
     _90 == true) {

    if(!_180) {
//      Serial.println("Rotation: 180");
    }
    _180 = true;
  }

  if(y < stepY + margin &&
     y > stepY - margin &&
     _180 == true) {

    if(!_270) {
//      Serial.println("Rotation: 270");
    }
    _270 = true;
  }

  if(y > 0 &&
     y < margin &&
     _270 == true) {

    if(direction == 1) {
      Serial.println(direction);
    }
    else {
      Serial.println(direction);
    }

    _0 = false;
    _90 = false;
    _180 = false;
    _270 = false;
    _360 = false;
    direction = 0;
  }

  previousY = y;
}

