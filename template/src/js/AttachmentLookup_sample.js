(() => {
  "use strict";
  const client = new KintoneRestAPIClient();
  const lookupField = 'Lookup';
  const KeyField = 'RecordID';
  const attachmentsField = 'Attachment';
  const targetTable = 'ProductsServices';
  const originAttachmentsField = 'Attachment';

  kintone.events.on([
    'app.record.create.submit.success',
    'app.record.edit.submit.success',
  ], async (event) => {
    const subtable = event.record[targetTable].value;
    const appId = kintone.app.getLookupTargetAppId(lookupField);
    const newRows = []; // 加工データ挿入用配列

    for await (let row of subtable){ 
      const key = row.value[KeyField].value;
      if(!key) {
        delete row.value[lookupField];
        newRows.push(row);
        continue;
      }
      const originRecord = await client.record.getRecord({app: appId, id: key});
      // ルックアップ元から添付ファイルをダウンロード
      const files = await Promise.all(originRecord.record[originAttachmentsField].value.map(async (originFileInfomation) => {
        const fileData = await client.file.downloadFile({fileKey: originFileInfomation.fileKey})
          return {
            file: {
              name: originFileInfomation.name,
              data: new Blob([fileData], {type: originFileInfomation.contentType})
            }
          };
        }));

      // ルックアップ先へ添付ファイル
      const copyFileInfomations = await Promise.all(files.map(async (file) => {
        return client.file.uploadFile(file);
      }));

      row.value[attachmentsField].value = copyFileInfomations;
      delete row.value[lookupField];
      newRows.push(row);
    };

    await client.record.updateRecord({
      app: event.appId,
      id: event.recordId,
      record: {
        [targetTable]:{
          value: newRows 
        }
      }
    })

    return event;
  });
})();