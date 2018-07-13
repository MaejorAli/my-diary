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

  static modifyEntry(req, res) {
    const id = parseFloat(req.params.entryId);
    let entry = null;
    db.map((rec) => {
      if (rec.id === id) {
        entry = rec;
      }
      return entry;
    });
    if (entry) {
      entry.title = req.body.title || entry.title;
      entry.story = req.body.story || entry.story;
      res.status(201).send({ message: 'Successfully Modified', error: false });
    } else {
      res.status(404).send({ message: 'Entry not found', error: true });
    }
  }
}


export default Entry;
