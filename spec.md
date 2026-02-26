# Connect Four

## Überblick
Eine 2D-Spielanwendung für das klassische Connect Four Spiel mit manueller Sprachauswahl und zwei Spielmodi: Einzelspieler gegen KI und lokaler Zweispielermodus. Die Anwendung bietet eine ansprechende und spielerische Benutzeroberfläche mit Animationen und Soundeffekten, optimiert für alle Bildschirmgrößen einschließlich Smartphones. Das Spiel verfügt über eine Zeitmessung und Bestenliste für die schnellsten Siege.

## Hauptfunktionen

### Internationalisierung
- Manuelle Sprachauswahl zwischen Englisch und Deutsch
- Deutsch als Standard-Sprache
- Sprachauswahl-Element an prominenter Stelle (Header oder Hauptmenü)
- Alle Benutzeroberflächen-Texte sind in beiden Sprachen verfügbar
- Automatisches Neuladen der Seite beim Sprachwechsel zur sofortigen Anwendung der neuen Spracheinstellung
- Dynamische Anpassung aller Menüs, Nachrichten und Spieltexte
- Konsistente Verwendung von "Connect Four" als Spielname in allen Texten, Menüs und Überschriften
- Nutzer können jederzeit zwischen den Sprachen wechseln

### Spielmodi
- **Einzelspielermodus**: Spieler gegen intelligente KI
- **Zweispielermodus**: Zwei Spieler abwechselnd am selben Gerät

### Spielmechanik
- Grafische Darstellung des 7x6 Spielfelds
- Spieler können Steine durch Klicken auf Spalten setzen
- Steine fallen automatisch nach unten in die unterste freie Position mit Fallanimation
- Abwechselnde Züge zwischen den Spielern
- Automatische Gewinnprüfung nach jedem Zug (4 in einer Reihe: horizontal, vertikal, diagonal)
- Erkennung von Unentschieden wenn das Spielfeld voll ist
- Nach Spielende erscheint eine Aufforderung, die den Spieler fragt, ob er erneut spielen möchte
- Bei Auswahl "Ja" startet ein neues Spiel in derselben Sitzung
- Im Einzelspielermodus wird die KI-Schwierigkeit mit jedem neuen Spiel in derselben Sitzung schrittweise erhöht

### Zeitmessung und Bestenliste
- Stoppuhr startet automatisch bei Spielbeginn und misst die Rundendauer
- Zeitmessung wird bei Spielende gestoppt
- Gewonnene Spiele werden mit der benötigten Zeit und dem Datum in einer Bestenliste gespeichert
- Bestenliste zeigt nur die 10 schnellsten Siege an
- Bestenliste wird nach Datum in absteigender Reihenfolge sortiert, und innerhalb jedes Datums nach Spieldauer in aufsteigender Reihenfolge
- Bestenlisten-Einträge werden visuell nach Tagen gruppiert und gerahmt, sodass die Ergebnisse jedes Tages klar getrennt und hervorgehoben sind
- Bestenliste kann nicht von Nutzern gelöscht oder zurückgesetzt werden
- Anzeige der aktuellen Spielzeit während des Spiels
- Bestenliste ist über das UI zugänglich und zeigt die Top-10-Zeiten

### KI-Verhalten
- Intelligente KI die bereits vom ersten Spiel an strategische und herausfordernde Züge macht
- KI verwendet fortgeschrittene Strategien wie Blockieren von Spielergewinnzügen und Erkennen eigener Gewinnmöglichkeiten
- KI reagiert sofort nach dem Spielerzug
- KI-Schwierigkeit startet bereits auf einem hohen Niveau und erhöht sich schrittweise mit jedem neuen Spiel in derselben Sitzung
- Schwierigkeitssteigerung erfolgt nur bei aufeinanderfolgenden Spielen ohne Rückkehr zum Hauptmenü

### Benutzeroberfläche und Benutzererfahrung
- Hauptmenü mit Kacheln für Modusauswahl und Navigation
- Zusätzliche Kachel im Hauptmenü für direkten Zugriff auf die Bestenliste
- Alle Kacheln im Hauptmenü folgen einem einheitlichen Design-Stil
- Sprachauswahl-Element an prominenter Stelle im Header oder Hauptmenü
- Farbenfrohes und spielerisches Design mit ansprechendem Spielbrett
- Visuell attraktive Spielsteine mit unterschiedlichen Farben
- Animierte Spielsteine beim Fallenlassen in die Spalten
- Visuelle Effekte für Gewinnzüge (Hervorhebung der gewinnenden Steine)
- Anzeige des aktuellen Spielers mit visuellen Indikatoren
- Anzeige der aktuellen Spielzeit während des Spiels
- Gewinn-/Unentschieden-Benachrichtigung mit visuellen Effekten
- Bestenliste mit den 10 schnellsten Zeiten im UI ohne Lösch- oder Reset-Funktionen
- Möglichkeit ein neues Spiel zu starten
- Dialog am Spielende mit der Frage, ob der Spieler erneut spielen möchte
- Optionen "Ja" und "Nein" im Dialog für die Fortsetzung

### Responsive Design für Mobile Geräte
- Spielfeld-Layout passt sich automatisch an verschiedene Bildschirmgrößen an
- Optimierte Darstellung für Smartphones mit angepassten Größen und Abständen
- Spielfeld bleibt auf kleineren Bildschirmen vollständig sichtbar und gut bedienbar
- Touch-optimierte Bedienung für mobile Geräte
- Alle UI-Elemente sind auf Smartphones übersichtlich und zugänglich

### Audio-Feedback
- Soundeffekte beim Platzieren von Spielsteinen
- Spezielle Soundeffekte bei Gewinn oder Unentschieden
- Spielerische Audioelemente für eine verbesserte Spielerfahrung
- Ansprechende Hintergrundmusik mit starkem Synthesizer-Sound während der Spielsitzung
- Hintergrundmusik ist abwechslungsreich und nicht monoton für ein verbessertes Spielerlebnis
- Hintergrundmusik läuft nahtlos in einer Schleife ohne störende Unterbrechungen
- Hintergrundmusik startet automatisch bei Spielbeginn und stoppt oder pausiert bei Spielende oder Pause
- Einfache Bedienelemente für Nutzer zum Stummschalten oder Anpassen der Hintergrundmusik-Lautstärke

## Technische Anforderungen

### Frontend
- Komplette Spiellogik und Spielzustand werden im Frontend verwaltet
- Zeitmessung erfolgt clientseitig
- Keine Persistierung des aktuellen Spielstands erforderlich
- Alle Berechnungen (Gewinnprüfung, KI-Züge) erfolgen clientseitig
- Implementierung einer intelligenten KI-Logik mit fortgeschrittenen Algorithmen für strategische Züge
- KI-Algorithmus erkennt Gewinnmöglichkeiten und blockiert Spielergewinnzüge bereits vom ersten Spiel an
- Implementierung von CSS-Animationen und Übergängen
- Integration von Audio-Elementen für Soundeffekte und neue Hintergrundmusik mit Synthesizer-Sound
- Audio-Steuerung für Hintergrundmusik mit Stummschaltung und Lautstärkeregelung
- Nahtlose Schleifenfunktion für die Hintergrundmusik ohne störende Unterbrechungen
- Cross-Browser-kompatible Audio-Implementierung mit spezifischer Safari-Unterstützung für Hintergrundmusik
- Safari-optimierte Spielfeld-Darstellung und CSS-Layout für korrekte Anzeige
- Responsive CSS-Design für optimale Darstellung auf allen Bildschirmgrößen
- Mobile-first Ansatz für Touch-Bedienung
- Manuelles Sprachauswahl-System zwischen Englisch und Deutsch mit automatischem Seitenneuladung bei Sprachwechsel
- Internationalisierungssystem für mehrsprachige Unterstützung mit Deutsch als Standard
- Dynamisches Laden der entsprechenden Sprachtexte basierend auf Nutzerauswahl
- Automatisches Neuladen der Seite zur sofortigen Anwendung der neuen Spracheinstellung
- Bestenliste zeigt nur die Top-10-Einträge ohne Lösch- oder Reset-Optionen
- Konsistente Verwendung von "Connect Four" als Spielname in allen UI-Elementen
- Dialog-System für "Erneut spielen"-Aufforderung am Spielende
- Sitzungsbasierte Verfolgung der KI-Schwierigkeitssteigerung
- Logik für schrittweise Erhöhung der KI-Schwierigkeit bei aufeinanderfolgenden Spielen
- Präzise visuelle Ausrichtung der Spielfeld-Reihen unter den entsprechenden Einwurföffnungen für ein sauberes und intuitives Erscheinungsbild auf allen Geräten und Browsern
- Visuelle Gruppierung und Rahmung der Bestenlisten-Einträge nach Tagen mit klarer Trennung und Hervorhebung

### Backend
- Speicherung der Bestenliste mit Spielzeiten und Datum für gewonnene Spiele
- Bereitstellung von Funktionen zum Abrufen und Speichern der Highscores mit Datum
- Automatische Begrenzung der Bestenliste auf die 10 besten Zeiten
- Sortierung der Bestenliste nach Datum in absteigender Reihenfolge, und innerhalb jedes Datums nach Spieldauer in aufsteigender Reihenfolge
- Schutz der Bestenliste vor Löschung oder Reset durch Nutzeraktionen
- Keine Backend-Funktionalität für die Spiellogik notwendig

## Sprache
- Anwendungssprache: Deutsch
- Manuelle Sprachauswahl zwischen Englisch und Deutsch
- Standard-Sprache: Deutsch
- Unterstützung für beide Sprachen mit vollständigen Übersetzungen
- Konsistente Verwendung von "Connect Four" als Spielname in allen Texten beider Sprachen
