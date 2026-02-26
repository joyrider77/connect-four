import OrderedMap "mo:base/OrderedMap";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Registry "blob-storage/registry";

persistent actor {
  type HighscoreEntry = {
    playerName : Text;
    time : Nat; // Zeit in Millisekunden
    timestamp : Int;
  };

  transient let highscoreMap = OrderedMap.Make<Nat>(Nat.compare);
  var highscores : OrderedMap.Map<Nat, HighscoreEntry> = highscoreMap.empty();
  var nextId : Nat = 0;

  let registry = Registry.new();

  public func addHighscore(playerName : Text, time : Nat) : async () {
    let entry : HighscoreEntry = {
      playerName;
      time;
      timestamp = Time.now();
    };
    highscores := highscoreMap.put(highscores, nextId, entry);
    nextId += 1;
  };

  public query func getHighscores() : async [HighscoreEntry] {
    let entries = Array.map<(Nat, HighscoreEntry), HighscoreEntry>(
      Iter.toArray(highscoreMap.entries(highscores)),
      func((_, entry)) { entry },
    );
    Array.sort<HighscoreEntry>(
      entries,
      func(a, b) {
        if (a.timestamp > b.timestamp) { #less } else if (a.timestamp < b.timestamp) {
          #greater;
        } else if (a.time < b.time) { #less } else if (a.time > b.time) {
          #greater;
        } else { #equal };
      },
    );
  };

  public query func getTopHighscores() : async [HighscoreEntry] {
    let entries = Array.map<(Nat, HighscoreEntry), HighscoreEntry>(
      Iter.toArray(highscoreMap.entries(highscores)),
      func((_, entry)) { entry },
    );
    let sortedEntries = Array.sort<HighscoreEntry>(
      entries,
      func(a, b) {
        if (a.timestamp > b.timestamp) { #less } else if (a.timestamp < b.timestamp) {
          #greater;
        } else if (a.time < b.time) { #less } else if (a.time > b.time) {
          #greater;
        } else { #equal };
      },
    );
    let limit = 10;
    if (sortedEntries.size() <= limit) {
      return sortedEntries;
    };
    Array.tabulate<HighscoreEntry>(limit, func(i) { sortedEntries[i] });
  };

  public func registerFileReference(path : Text, hash : Text) : async () {
    Registry.add(registry, path, hash);
  };

  public query func getFileReference(path : Text) : async Registry.FileReference {
    Registry.get(registry, path);
  };

  public query func listFileReferences() : async [Registry.FileReference] {
    Registry.list(registry);
  };

  public func dropFileReference(path : Text) : async () {
    Registry.remove(registry, path);
  };
};
