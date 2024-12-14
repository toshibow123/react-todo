import { useEffect, useState } from 'react'
import './App.css'
import { supabase } from './supabase';

type Record = {
  title: string;
  time: number;
}

const App = () => {
  const [study, setStudy] = useState<string>("");
  const [studyTime, setStudyTime] = useState<string>("");
  const [totalTime, setTotalTime] = useState<number>(0)
  const [error, setError] = useState<string>("");
  const [records, setRecords] = useState<Record[]>([]);

  useEffect(() => {
    const fetchRecords = async () => {
      const { data, error } = await supabase.from("study_records").select("*");
      if(error){
        console.error("データ取得エラー:", error);
        setError("データ取得中にエラーが発生しました。");
      } else {
        setRecords(data || []);
        const total = data?.reduce((sum, record) => sum + record.time, 0) || 0;
        setTotalTime(total);
      }
    };

    fetchRecords();
  },[]);

  const deleteRecords = async (title: string, time: number) => {
    /* https://qiita.com/AK_React/items/40f500d6d60933c98e23 参考 */
    try {
    const { error: supabaseError } = await supabase
    .from("study_records")
    .delete()
    /*以下はsupabaseのテーブルの値の名前と紐づくように*/
    .match({ title, time: Number(time) });

    if(supabaseError){
      console.error("Supabase Error:", supabaseError);
      setError("削除中にエラーが発生しました");
      return;
    }

    setRecords((prevRecords) => prevRecords.filter(
      (record) => record.title !== title || record.time !== time 
    ));

    setError("");
    console.log("削除が完了しました！");
  }catch(error) {
    console.error("Error deleting record:", error);
    setError("削除処理中にエラーが発生しました。");
  }
};



  const registration = async () => {
    console.log("registration function executed");
    /*studyじゃないまたはstudyTimeじゃない
    場合はsetError*/
    if(!study || !studyTime) {;
    setError("入力されていない項目があります。");
    return;
  }

  if (isNaN(Number(studyTime))){
    /*studyTimeをNumberに変換、isNaN(Not a Number)
    でnumberじゃなければsetError */
    setError("学習時間は数値で入力してください。");
    return;
  }

  setError("");

  const newRecord = { 
    title: study, 
    time: Number(studyTime)
   };

 const { error: supabaseError } = await supabase
 .from("study_records") // supabaseのテーブル名
 .insert([newRecord]);

if (supabaseError) {
  console.error("Supabase Error:", supabaseError);
  setError("データの保存中にエラーが発生しました。");
  return;
}
  
  

  /*フォームに入力した学習内容(study)と学習時間(studyTime)を
  辞書型にしてnewRecordに格納→それをスプレッド構文でrecordsの末尾に追加*/
  setRecords([newRecord, ...records]);
  setTotalTime((prevTotalTime) => prevTotalTime + newRecord.time);

  setStudy("");
  setStudyTime("");
  
};

  return (
      <div className='container'>
      <h1>学習記録アプリ</h1>
      <div>学習内容
      <input
       type="text"
       value={study}
        placeholder='ここに入力'
        onChange={(e) => setStudy(e.target.value)}
        />
      </div>
      <div>学習時間
      <input
       type="text" 
       placeholder='0'
       value={studyTime}
       onChange={(e) => setStudyTime(e.target.value)}
       />{" "}
       時間
      </div>
      <div>入力されている学習内容：{study}</div>
      <div>入力されている時間：{studyTime}時間</div>
      <button className='registrationButton' onClick={registration}>登録</button>
      <div>
  {error && <p style={{ color: "red" }}>{error}</p>}
</div>
      <div>
        <h2>合計時間：{totalTime}/1000(h)</h2>
        <h3>記録</h3>
      <div>
        <ul>
          {records.map((record, index) =>(
            <li key={index}>
              {record.title}: {record.time}時間
              <button onClick={()=> deleteRecords(record.title, record.time)}>削除</button>
            </li>
          ))}
          </ul>
          </div>
      </div>
      </div>
  )
}

export default App
