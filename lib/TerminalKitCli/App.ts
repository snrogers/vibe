import * as termkit from 'terminal-kit';
import { appStore } from '../App';
import type { AppState } from '../App/AppState';
import type { ChatMessage } from '../Domain/ChatSession';

// Create terminal instance
const term = termkit.terminal;

export class TerminalKitApp {
  private currentState: AppState;
  private unsubscribe:  () => void;
  private document: Document


  constructor() {
    // Initialize with current state
    this.currentState = appStore.getState();

    // Subscribe to state changes
    this.unsubscribe = appStore.subscribe(() => {
      const nextState = appStore.getState();
      this.handleStateChange(nextState);
      this.currentState = nextState;
    });

    this.document = new Document()
    this.initDocument()
  }

  private initDocument() {
    const doc = this.document

    doc.append(new Paragraph('Hello, World!'))
    doc.render()
  }

  private handleStateChange(state: AppState) {
    // TODO: Handle state changes
    console.log(state)
  }

  private getInputField() {
    const inputField = term.inputField({ 

    }).promise.then(input => {
      console.log(input)
    })
  }
}
