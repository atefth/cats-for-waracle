import { useState } from "react";
import { DropzoneDialog } from "material-ui-dropzone";
import { Button, Snackbar } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { uploadCat, clearUploadError } from "../../store/catsSlice";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function NewCat(props) {
  const dispatch = useDispatch();
  const { uploadError } = useSelector(({ cats }) => cats);

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
        filesLimit={1}
        open={open}
        onClose={() => setOpen(false)}
        onSave={(files) => {
          dispatch(uploadCat({ file: files[0] }));
          setOpen(false);
        }}
        showPreviews={true}
        showFileNamesInPreview={true}
      />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={uploadError !== undefined}
      >
        <Alert
          onClose={() => {
            dispatch(clearUploadError());
          }}
          severity="error"
        >
          {uploadError}
        </Alert>
      </Snackbar>
    </div>
  );
}
