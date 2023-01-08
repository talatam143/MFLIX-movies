import Comments from "../Models/comments.js";

export const getComments = async (req, res) => {
  const { id } = req.params;
  try {
    const comments = await Comments.find({ movie_id: id });
    if (!comments)
      return res.status(404).json({ error: "Something went wrong" });
    res.status(200).json({ data: { comments } });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
