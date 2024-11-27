import { useState, useRef } from "react";
import Appbar from "../components/Appbar";
import { Backendurl, tags } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import JoditEditor from "jodit-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Modal from "react-modal";
import Select from "react-select";

Modal.setAppElement("#root");

const Publish = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [emojis, setEmojis] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();
  const editor = useRef(null);

  const config = {
    readonly: false,
    buttons: [
      "bold",
      "italic",
      "underline",
      "|",
      "ul",
      "ol",
      "|",
      "font",
      "fontsize",
      "brush",
      "|",
      "image",
      "link",
      "|",
      "align",
      "undo",
      "redo",
    ],
    uploader: { insertImageAsBase64URI: true },
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSelectChange = (selectedOptions) => {
    setSelectedItems(selectedOptions || []);
  };

  const handlePublish = async () => {
    try {
      const response = await axios.post(
        `${Backendurl}/api/v1/blog`,
        {
          title,
          content: description,
          tags: selectedItems.map((tag) => tag.value), // Extract tag values
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      navigate("/blog/" + response.data.id);
    } catch (error) {
      console.error("Error publishing post:", error);
    }
  };

  return (
    <div>
      <Appbar />
      <div className="flex justify-center w-full pt-8 pb-8">
        <div className="max-w-screen-lg w-full">
          <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            placeholder="Title"
          />
          <JoditEditor
            ref={editor}
            value={description}
            config={config}
            onBlur={(newContent) => setDescription(newContent)}
          />
          <button
            className="relative bottom-14 left-2 scale-125 hover:scale-150"
            onClick={() => setEmojis(!emojis)}
          >
            {emojis ? "😁" : "😀"}
          </button>
          <br />
          {emojis && (
            <Picker
              data={data}
              onEmojiSelect={(emoji) => {
                setDescription((prev) => prev + emoji.native);
              }}
            />
          )}

          <button
            onClick={handleOpenModal}
            className="block px-2 py-2 bg-red-600 text-white rounded-lg"
          >
            Add Tags
          </button>

          <Modal
            isOpen={isModalOpen}
            onRequestClose={handleCloseModal}
            style={{
              content: {
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "400px",
                padding: "20px",
              },
            }}
          >
            <h2>Select Tags</h2>
            <Select
              options={tags}
              isMulti
              onChange={handleSelectChange}
              value={selectedItems}
            />
            <button
              onClick={handleCloseModal}
              className="bg-red-500 text-white mt-4 px-4 py-2 rounded"
            >
              Close
            </button>
            <div className="mt-4">
              <h3>Selected Tags:</h3>
              <ul>
                {selectedItems.map((item) => (
                  <li key={item.value}>{item.label}</li>
                ))}
              </ul>
            </div>
          </Modal>

          <button
            onClick={handlePublish}
            className="mt-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Publish Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default Publish;
