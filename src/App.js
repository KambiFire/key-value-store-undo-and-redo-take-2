import "./styles.css";

/*
Task:
Create a function that returns a new basic key/value store. 
What is special about this store is that it will support undo and redo of its history. 
This function takes an object and returns an object that has the following functions defined on it. 

Methods:
  set(key, value) Assigns the value to the key. If the key does not exist, creates it. 
  get( key) Returns the value associated to the key. 
  del(key) removes the key from the object. 
  undo() Undo the last operation (set or del) on the object. Throws an exception if there is no operation to undo. 
  redo() Redo the last undo operation (redo is only possible after an undo). Throws an exception if there is no operation to redo. 

After set () or del () are called, there is nothing to redo. 
All actions must affect to the object passed to undoRedo(object) function. So you cannot work with a copy of the object. 
Any set/del after an undo should disallow new undos .
*/

export default function App() {
  // undoRedo(object) function.
  const undoRedo = (object) => {
    var hist = [{ ...object }];
    var histPos = 0;
    var histRedo = false;

    const reset = () => {
      histRedo = false;
      hist = [{ ...object }];
      histPos = 0;
    };

    const getting = (key) =>
      object[Object.keys(object).find((keyToFind) => keyToFind === key)];

    const setting = (key, value) => {
      if (histRedo) reset();
      object[key] = value;
      hist.unshift({ ...object });
    };

    const deleting = (key) => {
      const value = getting(key);
      if (value) {
        delete object[key];
        if (histRedo) reset();
        hist.unshift({ ...object });
      } else throw new Error(`Cannot delete: ${key} not found!`);
    };

    const undoing = () => {
      if (hist.length > 0 && histPos + 1 < hist.length) {
        histRedo = true;
        histPos += 1;
        updateObjectHelper(hist[histPos]);
      } else throw new Error(`Cannot undo: Nothing to undo!`);
    };

    const redoing = () => {
      if (histRedo && hist.length > 0 && histPos > 0) {
        histPos -= 1;
        updateObjectHelper(hist[histPos]);
      } else throw new Error(`Cannot redo: Nothing to redo!`);
    };

    const updateObjectHelper = (obj) => {
      // Clear object
      for (const key in object) delete object[key];
      // Update object with new values
      for (const key in obj) object[key] = obj[key];
    };

    // Methods (in Closures)
    return {
      set(key, value) {
        setting(key, value);
      },
      get(key) {
        return getting(key);
      },
      del(key) {
        deleting(key);
      },
      undo() {
        undoing();
      },
      redo() {
        redoing();
      }
    };
  };
  /*
   **
   **** Drivers *****/
  fullX(undoRedo);
  // deletingX(undoRedo);
  // undoingX(undoRedo);
  // redoingX(undoRedo);
  // undoRedoMix(undoRedo);

  return (
    <div className="App">
      <h1>Basic key/value store</h1>
      <h2>Support set, delete, undo and redo</h2>
    </div>
  );
}

/***** Driver functions *****/
const redoingX = (undoRedo) => {
  const obj = {
    x: 1,
    y: 2
  };

  const unRe = undoRedo(obj);

  unRe.set("z", 10);
  if (unRe.get("z") === 10) console.log("A new key has been added");
  else console.error("Test failed");
  unRe.undo();
  if (unRe.get("z") === undefined) console.log("The z key should not exist");
  else console.error("Test failed");
  unRe.redo();
  if (unRe.get("z") === 10) console.log("A new key has been added");
  else console.error("Test failed");
};

const deletingX = (undoRedo) => {
  const obj = {
    x: 1,
    y: 2
  };

  const unRe = undoRedo(obj);

  unRe.del("x");
  if (unRe.get("x") === undefined) console.log("The x key should not exist");
  else console.error("Test failed");
  if (!obj.hasOwnProperty("x")) console.log("The x key should be deleted");
  else console.error("Test failed");
  unRe.undo();
  if (unRe.get("x") === 1) console.log("A new key has been added");
  else console.error("Test failed");
  unRe.redo();
  if (unRe.get("x") === undefined) console.log("The x key should not exist");
  else console.error("Test failed");
  if (!obj.hasOwnProperty("x")) console.log("The x key should be deleted");
  else console.error("Test failed");
};

const undoingX = (undoRedo) => {
  const obj = {
    x: 1,
    y: 2
  };

  const unRe = undoRedo(obj);

  unRe.set("y", 10);
  if (unRe.get("y") === 10) console.log("y key has been added");
  else console.error("Test failed");
  unRe.undo();
  if (unRe.get("y") === 2)
    console.log("The undo method restores the previous state");
  else console.error("Test failed");
  try {
    unRe.undo();
  } catch (error) {
    console.info("Error!", error.message);
  }
  if (unRe.get("y") === 2) console.log("The previous state exists after throw");
  else console.error("Test failed");
};

const fullX = (undoRedo) => {
  const obj = {};
  const unRe = undoRedo(obj);

  if (Object.keys(obj).length === 0) console.log("The obj object has no keys");
  else console.error("Test failed");
  unRe.set("x", 5);
  if (unRe.get("x") === 5) console.log("x key has been added");
  else console.error("Test failed");
  unRe.set("y", 10);
  if (unRe.get("y") === 10) console.log("y key has been added");
  else console.error("Test failed");
  unRe.set("y", 8);
  if (unRe.get("y") === 8) console.log("y key has changed its value");
  else console.error("Test failed");
  unRe.del("y");
  if (unRe.get("y") === undefined) console.log("y key has been deleted");
  else console.error("Test failed");

  unRe.undo();
  if (unRe.get("y") === 8) console.log("Undo: y key has 8 value");
  else console.error("Test failed");
  unRe.undo();
  if (unRe.get("y") === 10) console.log("Undo: y key has 10 value");
  else console.error("Test failed");
  unRe.undo();
  if (unRe.get("y") === undefined) console.log("Undo: y key should not exist");
  else console.error("Test failed");
  unRe.undo();
  if (unRe.get("x") === undefined) console.log("Undo: x key should not exist");
  else console.error("Test failed");
  unRe.redo();
  unRe.redo();
  unRe.redo();
  if (obj.x === 5 && obj.y === 8) console.log("Redo: Redo all actions");
  else console.error("Test failed");
  unRe.redo();
  unRe.set("x", 55);
  if (obj.x === 55) console.log("Redo three actions");
  else console.error("Test failed");
  unRe.undo();
  if (obj.x === 5) console.log("Redo one actions");
  else console.error("Test failed");
};

const undoRedoMix = (undoRedo) => {
  const obj = {
    x: 1,
    y: 2
  };

  const unRe = undoRedo(obj);

  unRe.set("y", 10);
  unRe.set("y", 100);
  unRe.set("x", 150);
  unRe.set("x", 50);
  if (unRe.get("y") === 100)
    console.log("The get method returns the value of a y");
  else console.error("Test failed");
  if (unRe.get("x") === 50)
    console.log("The get method returns the value of a x");
  else console.error("Test failed");
  unRe.undo();
  if (unRe.get("x") === 150)
    console.log("The undo method restores the previous state");
  else console.error("Test failed");
  if (unRe.get("y") === 100) console.log("The y key stays the same");
  else console.error("Test failed");
  unRe.redo();
  if (unRe.get("x") === 50) console.log("Undo the x value");
  else console.error("Test failed");
  if (unRe.get("y") === 100) console.log("The y key stays the same");
  else console.error("Test failed");
  unRe.undo();
  unRe.undo();
  if (unRe.get("x") === 1) console.log("Undo the x value");
  else console.error("Test failed");
  if (unRe.get("y") === 100) console.log("The y key stays the same");
  else console.error("Test failed");
  unRe.undo();
  unRe.undo();
  if (unRe.get("y") === 2) console.log("Undo the y value");
  else console.error("Test failed");
  if (unRe.get("x") === 1) console.log("The x key stays the same");
  else console.error("Test failed");
  try {
    unRe.undo();
  } catch (error) {
    console.info("Error!", error.message);
  }
  if (unRe.get("y") === 2) console.log("There is nothing to undo");
  else console.error("Test failed");
  unRe.redo();
  unRe.redo();
  unRe.redo();
  unRe.redo();
  if (unRe.get("y") === 100) console.log("y key redo state");
  else console.error("Test failed");
  if (unRe.get("x") === 50) console.log("x key redo state");
  else console.error("Test failed");
  try {
    unRe.redo();
  } catch (error) {
    console.info("Error!", error.message);
  }
  if (unRe.get("y") === 100) console.log("There is nothing to redo");
  else console.error("Test failed");
};
