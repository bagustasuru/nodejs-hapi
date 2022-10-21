const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    title, tags, body, id, createdAt, updatedAt,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'Success',
      message: 'Note has been created',
      data: {
        noteId: id,
      },
    });

    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'Failed',
    message: 'Failed create note',
  });
  response.code(500);
  return response;
};

const getNoteListHandler = () => ({
  status: 'Success',
  data: {
    notes,
  },
});

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.filter((n) => n.id === id)[0];

  if (note !== undefined) {
    return {
      status: 'Success',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'Failed',
    message: 'Note not found',
  });
  response.code(404);

  return response;
};

const editNoteHandler = (request, h) => {
  const { id } = request.params;

  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toDateString();

  const index = notes.findIndex((n) => n.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    const response = h.response({
      status: 'Success',
      message: 'Success edit note',
    });

    response.code(200);

    return response;
  }

  const response = h.response({
    status: 'Failed',
    message: 'Failed to edit note',
  });

  response.code(500);

  return response;
};

const deleteNoteHandler = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((n) => n.id === id);

  if (index !== -1) {
    notes.splice(index, 1);

    const response = h.response({
      status: 'Success',
      message: 'Note has been deleted',
    });

    response.code(200);

    return response;
  }

  const response = h.response({
    status: 'Failed',
    message: 'Failed to delete note',
  });

  response.code(500);

  return response;
};

module.exports = {
  addNoteHandler,
  getNoteListHandler,
  getNoteByIdHandler,
  editNoteHandler,
  deleteNoteHandler,
};
