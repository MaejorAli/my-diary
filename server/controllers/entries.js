import db from '../db';


let idTracker = 0;


class Entry {
  static addEntry(req, res) {
    const { title, story } = req.body;
    const currentDate = `${new Date()}`;
    const createdAt = currentDate.slice(0, 24);
    const updatedAt = currentDate.slice(0, 24);
    idTracker = db.length + 1;
    const id = idTracker;
    const response = {
      id,
      title,
      story,
      createdAt,
      updatedAt,
    };
    db.push(response);
    res.status(201).send({ message: 'Entry successfully created and saved', error: false, response });
  }
}


export default Entry;
