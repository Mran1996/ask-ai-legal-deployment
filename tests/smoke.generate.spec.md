# Smoke Tests for Ask AI Legal Document Generation

This document outlines smoke tests to verify the core functionality of the Ask AI Legal system after porting to another application.

## Test Environment Setup

### Prerequisites
- OpenAI API key configured
- All core files copied and properly imported
- Environment variables set
- Dependencies installed

### Test Data
```json
{
  "userInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "category": "Criminal Defense"
  },
  "caseInfo": {
    "state": "CA",
    "legalIssue": "Ineffective assistance of counsel",
    "opposingParty": "State of California",
    "desiredOutcome": "New trial",
    "courtName": "Superior Court of California",
    "caseNumber": "CR-2024-001",
    "county": "Los Angeles"
  },
  "documentContext": {
    "extractedCaseNumber": "CR-2024-001",
    "extractedCourt": "Superior Court of California",
    "extractedOpposingParty": "State of California",
    "extractedState": "CA",
    "documentType": "Motion for New Trial"
  }
}
```

## Test Cases

### 1. System Initialization Test

**Objective:** Verify the system initializes correctly

**Steps:**
1. Import the required hooks and components
2. Initialize the intake system
3. Check that state machine is created
4. Verify default state values

**Expected Results:**
- No import errors
- State machine initializes with phase 1
- All required state properties are present
- No console errors

**Code:**
```typescript
import { useIntake } from './ui/useIntake';
import { useGenerateDocument } from './ui/useGenerateDocument';

// Should not throw errors
const intake = useIntake();
const docGen = useGenerateDocument();
```

### 2. Interview Flow Test

**Objective:** Verify the 5-phase interview process works correctly

**Steps:**
1. Start the interview
2. Submit answers for each phase
3. Verify phase progression
4. Check completion criteria

**Expected Results:**
- Interview starts in phase 1
- Each phase progresses correctly (1→2→3→4→5)
- Questions are asked one at a time
- Interview completes after all phases
- Completion percentage increases correctly

**Test Data:**
```typescript
const testAnswers = [
  "I'm facing criminal charges for theft",
  "The incident occurred on January 15, 2024",
  "I believe my attorney didn't properly investigate",
  "I want a new trial with competent counsel",
  "I need a motion for new trial"
];
```

### 3. Document Context Integration Test

**Objective:** Verify uploaded documents are properly integrated

**Steps:**
1. Provide document context
2. Start interview
3. Verify questions reference document data
4. Check that duplicate questions are avoided

**Expected Results:**
- Questions confirm information from documents
- No duplicate questions for known information
- Document data is properly normalized
- Context is maintained throughout interview

### 4. Document Generation Test

**Objective:** Verify legal documents are generated correctly

**Steps:**
1. Complete the interview process
2. Initiate document generation
3. Verify document structure
4. Check content quality

**Expected Results:**
- Document generation completes successfully
- Generated document is 8-20 pages
- Proper legal formatting (court caption, sections)
- No placeholder text or disclaimers
- IRAC/CRAC structure for arguments

**Validation Criteria:**
- Starts with court caption (no introductory text)
- Contains all required sections
- Uses proper legal language
- Includes verification and signature blocks
- No markdown formatting or code blocks

### 5. Error Handling Test

**Objective:** Verify graceful error handling

**Steps:**
1. Test with invalid API key
2. Test with malformed data
3. Test network failures
4. Test rate limiting

**Expected Results:**
- Graceful fallback to fallback provider
- User-friendly error messages
- System remains functional
- No crashes or unhandled exceptions

### 6. State Persistence Test

**Objective:** Verify state is maintained correctly

**Steps:**
1. Start interview and answer questions
2. Simulate page refresh
3. Check state restoration
4. Verify data integrity

**Expected Results:**
- State persists across sessions
- Interview can be resumed
- No data loss
- Proper state validation

### 7. Performance Test

**Objective:** Verify system performance under load

**Steps:**
1. Generate multiple documents
2. Test concurrent interviews
3. Monitor response times
4. Check memory usage

**Expected Results:**
- Response times under 30 seconds
- No memory leaks
- Graceful handling of concurrent requests
- Proper resource cleanup

## Automated Test Script

```typescript
// smoke-test.ts
import { useIntake } from './ui/useIntake';
import { useGenerateDocument } from './ui/useGenerateDocument';

async function runSmokeTests() {
  console.log('🧪 Starting Ask AI Legal Smoke Tests...');
  
  // Test 1: System Initialization
  try {
    const intake = useIntake();
    const docGen = useGenerateDocument();
    console.log('✅ System initialization test passed');
  } catch (error) {
    console.error('❌ System initialization test failed:', error);
    return false;
  }
  
  // Test 2: Interview Flow
  try {
    const intake = useIntake();
    intake.startInterview();
    
    // Simulate interview completion
    const testAnswers = [
      "Criminal defense case",
      "The incident occurred on January 15, 2024",
      "Ineffective assistance of counsel",
      "I want a new trial",
      "Motion for new trial"
    ];
    
    for (const answer of testAnswers) {
      await intake.submitAnswer(answer);
    }
    
    if (intake.isComplete) {
      console.log('✅ Interview flow test passed');
    } else {
      throw new Error('Interview did not complete');
    }
  } catch (error) {
    console.error('❌ Interview flow test failed:', error);
    return false;
  }
  
  // Test 3: Document Generation
  try {
    const docGen = useGenerateDocument();
    const options = {
      state: 'CA',
      documentType: 'Motion for New Trial',
      parties: { petitioner: 'John Doe', respondent: 'State of California' },
      caseNumber: 'CR-2024-001',
      facts: ['Test fact 1', 'Test fact 2'],
      issues: ['Ineffective assistance of counsel']
    };
    
    await docGen.generateDocument(options);
    
    if (docGen.result?.success && docGen.result.document) {
      console.log('✅ Document generation test passed');
    } else {
      throw new Error('Document generation failed');
    }
  } catch (error) {
    console.error('❌ Document generation test failed:', error);
    return false;
  }
  
  console.log('🎉 All smoke tests passed!');
  return true;
}

// Run tests
runSmokeTests().then(success => {
  process.exit(success ? 0 : 1);
});
```

## Manual Testing Checklist

### Interview Process
- [ ] Interview starts correctly
- [ ] Questions are asked one at a time
- [ ] All 5 phases are completed
- [ ] Document context is properly used
- [ ] Completion message appears
- [ ] No formatting in responses
- [ ] Humanized, conversational tone

### Document Generation
- [ ] Document generation initiates
- [ ] Generated document is comprehensive (8-20 pages)
- [ ] Proper legal formatting
- [ ] Court caption at the beginning
- [ ] All required sections present
- [ ] No placeholder text
- [ ] Professional legal language
- [ ] Verification and signature blocks

### Error Handling
- [ ] Invalid API key handled gracefully
- [ ] Network errors don't crash system
- [ ] Malformed data is validated
- [ ] User-friendly error messages
- [ ] Fallback provider works

### Performance
- [ ] Response times under 30 seconds
- [ ] No memory leaks
- [ ] Concurrent requests handled
- [ ] Proper resource cleanup

## Troubleshooting

### Common Issues

**Import Errors:**
- Verify all files are copied correctly
- Check TypeScript configuration
- Ensure dependencies are installed

**API Errors:**
- Verify OpenAI API key is valid
- Check rate limits
- Test with minimal requests

**State Issues:**
- Check state machine implementation
- Verify data normalization
- Review error logs

**Document Generation Issues:**
- Validate prompt composition
- Check system prompt format
- Review generated content

### Debug Commands

```bash
# Check environment variables
echo $OPENAI_API_KEY

# Test API connectivity
curl -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models

# Run with debug logging
DEBUG=ask-legal:* npm run dev
```

## Success Criteria

The port is considered successful when:

1. ✅ All smoke tests pass
2. ✅ Manual testing checklist is complete
3. ✅ No console errors or warnings
4. ✅ Generated documents meet quality standards
5. ✅ Interview flow matches original behavior
6. ✅ Error handling works correctly
7. ✅ Performance is acceptable

## Next Steps

After passing all tests:

1. Deploy to staging environment
2. Conduct user acceptance testing
3. Monitor performance metrics
4. Implement monitoring and logging
5. Set up automated testing pipeline
6. Document any customizations made
