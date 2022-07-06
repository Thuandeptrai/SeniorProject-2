import React from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import axios from "axios";
import Cookies from "js-cookie";
export default function Home() {
  const [code, setCode] = React.useState(`var a=1;`);
  const [lang, setLang] = React.useState("cpp");
  const [stdin, setStdin] = React.useState(null);

  console.log(Cookies.get("session"));
  const transport = axios.create({
    withCredentials: true,
  });
  const handleClick = async (e) => {
    e.preventDefault();
    await transport
      .post("http://localhost:3001/Testcompiler",{
        code,
        lang,
        stdin
      })
      .then((res) => console.log(res.data))
      .catch((err) => {
        /* not hit since no 401 */
      });
  };
  return (
    <>
      <select
        onChange={(e) => {
          setLang(e.target.value);
        }}
        value={lang}
      >
        <option value="cpp">C/C++</option>
        <option value="Python">Python</option>
        <option value="Java">Java</option>
        <option value="Javascript">Javascript</option>
      </select>
      <CodeEditor
        value={code}
        language={lang}
        placeholder="Please enter JS code."
        onChange={(evn) => setCode(evn.target.value)}
        padding={15}
        style={{
          fontSize: 30,
          backgroundColor: "#f5f5f5",
          fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
        }}
      />
      <button
        onClick={(e) => {
          handleClick(e);
        }}
      >
        Test
      </button>
    </>
  );
}
