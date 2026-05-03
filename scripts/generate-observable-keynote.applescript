on joinParagraphs(paragraphsList)
  set AppleScript's text item delimiters to return
  set joinedText to paragraphsList as text
  set AppleScript's text item delimiters to ""
  return joinedText
end joinParagraphs

on addTitleBodySlide(docRef, layoutName, slideTitle, bodyParagraphs)
  tell application "Keynote"
    tell docRef
      set newSlide to make new slide with properties {base slide:master slide layoutName}
      tell newSlide
        if slideTitle is not "" then
          set object text of default title item to slideTitle
        end if
        if bodyParagraphs is not {} then
          set object text of default body item to my joinParagraphs(bodyParagraphs)
        end if
      end tell
    end tell
  end tell
end addTitleBodySlide

on addSectionSlide(docRef, layoutName, slideTitle, subtitleText)
  tell application "Keynote"
    tell docRef
      set newSlide to make new slide with properties {base slide:master slide layoutName}
      tell newSlide
        set object text of default title item to slideTitle
        set object text of default body item to subtitleText
      end tell
    end tell
  end tell
end addSectionSlide

on run argv
  if (count of argv) is 0 then
    set outputPath to (POSIX path of ((path to desktop folder) as text)) & "Observable Presentation.key"
  else
    set outputPath to item 1 of argv
  end if

  tell application "Keynote"
    activate
    set docRef to make new document with properties {document theme:theme "Modern Type"}

    tell docRef
      set object text of default title item of current slide to "RxJS Observable"
      set object text of default body item of current slide to "Streams you can start, stop, and shape"
    end tell

    my addTitleBodySlide(docRef, "Title & Bullets", "Why this matters", {"Search: the latest query matters more than every keystroke.", "Dashboards: values keep arriving, so one result is not enough.", "Cleanup: when the screen disappears, timers and requests should stop."})

    my addTitleBodySlide(docRef, "Title & Bullets", "Pull vs push", {"Pull systems wait for the consumer to ask for data.", "Push systems deliver data when the producer decides it is ready.", "Observables are lazy push collections of multiple values over time."})

    my addTitleBodySlide(docRef, "Title & Bullets", "Observable mental model", {"Create an observable by storing producer logic.", "Call subscribe() to start a fresh execution for one observer.", "That execution emits next values, then either complete() or error()."})

    my addTitleBodySlide(docRef, "Title & Bullets", "What RxJS emphasizes", {"Observable grammar: next* then at most one error or complete.", "Each subscription represents active work.", "unsubscribe() tears down timers, listeners, and other resources."})

    my addTitleBodySlide(docRef, "Title & Bullets", "Observable vs Promise", {"Observable: lazy, zero to many values, sync or async, cancellable.", "Promise: eager, one future result, no built-in cancellation in the core API.", "Use observables when the problem is a stream rather than a single outcome."})

    my addTitleBodySlide(docRef, "Title & Bullets", "Real world example: search box", {"Turn input events into a stream.", "debounceTime and distinctUntilChanged remove noise.", "switchMap keeps only the latest in-flight request."})

    my addTitleBodySlide(docRef, "Title & Bullets", "Real world example: live dashboard", {"interval(...) can trigger repeated polling.", "Each tick fetches a fresh metrics snapshot.", "One unsubscribe stops future polling and frees resources."})

    my addTitleBodySlide(docRef, "Title & Bullets", "Real world example: countdown and cleanup", {"This repo's timer observable starts work only on subscribe().", "The executor returns cleanup that clears the interval.", "After unsubscribe(), no further values should arrive."})

    my addTitleBodySlide(docRef, "Title & Bullets", "Mapping this repo to RxJS", {"Local playground: Observable, Observer, Subscription, cleanup function.", "RxJS: Observable, Subscriber, Subscription, teardown logic.", "The concepts match; RxJS adds operators and interoperability."})

    my addTitleBodySlide(docRef, "Title & Bullets", "Creating streams quickly", {"of(...) and from(...) explain emissions.", "interval(...) and timer(...) explain time and teardown.", "These are the fastest way to introduce observable thinking in code."})

    my addSectionSlide(docRef, "Quote", "The practical takeaway", "If a value changes over time, model it as a stream and decide when to subscribe, transform, and unsubscribe.")

    my addTitleBodySlide(docRef, "Title & Bullets", "References", {"RxJS Observable Guide", "RxJS Overview", "RxJS Observable API", "Local files: observable.ts, observable.usage.ts, 2. observable.md"})

    save docRef in POSIX file outputPath
  end tell

  return outputPath
end run