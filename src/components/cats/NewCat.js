import { useState } from "react";
import { DropzoneDialog } from "material-ui-dropzone";
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import { uploadCat } from "../../store/catsSlice";

export default function NewCat(props) {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Add Image
      </Button>

      <DropzoneDialog
        acceptedFiles={["image/*"]}
        cancelButtonText={"cancel"}
        submitButtonText={"submit"}
        maxFileSize={5000000}
        open={open}
        onClose={() => setOpen(false)}
        onSave={(files) => {
          dispatch(uploadCat(files[0]));
          setOpen(false);
        }}
        showPreviews={true}
        showFileNamesInPreview={true}
      />
    </div>
  );
}
