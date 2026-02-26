import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Registry "blob-storage/registry";

persistent actor Main {
  type HighscoreEntry = {
    playerName : Text;
    time : Nat; 
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

type __CAFFEINE_STORAGE_RefillInformation = {
    proposed_top_up_amount: ?Nat;
};

type __CAFFEINE_STORAGE_RefillResult = {
    success: ?Bool;
    topped_up_amount: ?Nat;
};

    public shared (msg) func __CAFFEINE_STORAGE_refillCashier(refill_information: ?__CAFFEINE_STORAGE_RefillInformation) : async __CAFFEINE_STORAGE_RefillResult {
    let cashier = Principal.fromText("72ch2-fiaaa-aaaar-qbsvq-cai");
    
    assert (cashier == msg.caller);
    
    let current_balance = Cycles.balance();
    let reserved_cycles : Nat = 400_000_000_000;
    
    let current_free_cycles_count : Nat = Nat.sub(current_balance, reserved_cycles);
    
    let cycles_to_send : Nat = switch (refill_information) {
        case null { current_free_cycles_count };
        case (?info) {
            switch (info.proposed_top_up_amount) {
                case null { current_free_cycles_count };
                case (?proposed) { Nat.min(proposed, current_free_cycles_count) };
            }
        };
    };

    let target_canister = actor(Principal.toText(cashier)) : actor {
        account_top_up_v1 : ({ account : Principal }) -> async ();
    };
    
    let current_principal = Principal.fromActor(Main);
    
    await (with cycles = cycles_to_send) target_canister.account_top_up_v1({ account = current_principal });
    
    return {
        success = ?true;
        topped_up_amount = ?cycles_to_send;
    };
};
    public shared (msg) func __CAFFEINE_STORAGE_blobsToRemove() : async [Text] {
    await Registry.requireAuthorized(registry, msg.caller, "72ch2-fiaaa-aaaar-qbsvq-cai");
    
    Registry.getBlobsToRemove(registry);
};
    public shared (msg) func __CAFFEINE_STORAGE_blobsRemoved(hashes : [Text]) : async Nat {
    await Registry.requireAuthorized(registry, msg.caller, "72ch2-fiaaa-aaaar-qbsvq-cai");
    
    Registry.clearBlobsRemoved(registry, hashes);
};
    public shared (msg) func __CAFFEINE_STORAGE_updateGatewayPrincipals() : async () {
    await Registry.requireAuthorized(registry, msg.caller, "72ch2-fiaaa-aaaar-qbsvq-cai");
    await Registry.updateGatewayPrincipals(registry, "72ch2-fiaaa-aaaar-qbsvq-cai");
};
};
