export const idlFactory = ({ IDL }) => {
  const FileReference = IDL.Record({ 'hash' : IDL.Text, 'path' : IDL.Text });
  const HighscoreEntry = IDL.Record({
    'time' : IDL.Nat,
    'timestamp' : IDL.Int,
    'playerName' : IDL.Text,
  });
  return IDL.Service({
    'addHighscore' : IDL.Func([IDL.Text, IDL.Nat], [], []),
    'dropFileReference' : IDL.Func([IDL.Text], [], []),
    'getFileReference' : IDL.Func([IDL.Text], [FileReference], ['query']),
    'getHighscores' : IDL.Func([], [IDL.Vec(HighscoreEntry)], ['query']),
    'getTopHighscores' : IDL.Func([], [IDL.Vec(HighscoreEntry)], ['query']),
    'listFileReferences' : IDL.Func([], [IDL.Vec(FileReference)], ['query']),
    'registerFileReference' : IDL.Func([IDL.Text, IDL.Text], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
