import React, { useState } from "react";

// Import React FilePond
import { FilePond, File, registerPlugin } from "react-filepond";

import { useLocation } from "react-router-dom";

import { useGetUserQuery } from "../../features/user/userApiSlice";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

import { useDispatch, useSelector } from "react-redux";
import { setImgUrl, stateData } from "../../stateSlice";

import FilePondPluginImageCrop from "filepond-plugin-image-crop";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";

registerPlugin(
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginImageCrop
);

// Our app

export default function App() {
  const { pathname } = useLocation();
  const { data: userData } = useGetUserQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const dispatch = useDispatch();
  const { currentOption, imgUrl } = useSelector(stateData);

  const [files, setFiles] = useState([]);
  return (
    <div className="App">
      {pathname === "/dash/election" && (
        <FilePond
          files={files}
          onupdatefiles={setFiles}
          allowMultiple={true}
          maxFiles={1}
          server={{
            url: `${process.env.REACT_APP_DOMAIN}/optionUpload`,
            process: {
              url: "",
              method: "POST",
              withCredentials: true,
              headers: {
                optionid: currentOption,
              },
              onload: (res) => {
                const data = JSON.parse(res);
                dispatch(setImgUrl(data));
              },
            },
            revert: {
              url: "/delete",
              withCredentials: true,
              headers: {
                optionid: currentOption,
                imgpath: imgUrl?.path,
              },
            },
          }}
          allowImageResize={true}
          imageResizeTargetWidth={100}
          imageResizeTargetHeight={100}
          allowImagePreview={false}
          name="files"
          labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
          allowFileSizeValidation={true}
          maxFileSize={"2mb"}
          labelMaxFileSizeExceeded={"File is more than 2mb"}
          allowFileTypeValidation={true}
          acceptedFileTypes={["image/png", "image/jpeg"]}
          labelFileTypeNotAllowed="only image file is allowed"
        />
      )}
      {pathname === "/dash/profile" && (
        <FilePond
          files={files}
          onupdatefiles={setFiles}
          allowMultiple={true}
          maxFiles={1}
          server={{
            url: `${process.env.REACT_APP_DOMAIN}/upload`,
            process: {
              url: "",
              method: "POST",
              withCredentials: true,
              headers: {
                optionid: userData?._id,
              },
              onload: (res) => {
                dispatch(setImgUrl(res));
              },
            },
            revert: {
              url: "",
              withCredentials: true,
              headers: {
                optionid: userData?._id,
              },
            },
          }}
          allowImageResize={true}
          imageResizeTargetWidth={100}
          imageResizeTargetHeight={100}
          allowImagePreview={true}
          name="files"
          labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
          allowFileSizeValidation={true}
          maxFileSize={"2mb"}
          labelMaxFileSizeExceeded={"File is more than 2mb"}
          allowFileTypeValidation={true}
          acceptedFileTypes={["image/png", "image/jpeg"]}
          labelFileTypeNotAllowed="only image file is allowed"
        />
      )}
    </div>
  );
}
