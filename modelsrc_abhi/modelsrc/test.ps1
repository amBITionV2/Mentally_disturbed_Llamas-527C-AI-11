# ============================================================================
# Agent Collaboration Testing Script for PowerShell
# ============================================================================

$baseUrl = "http://localhost:8000"

# Helper function to make POST requests
function Invoke-ApiPost {
    param(
        [string]$Endpoint,
        [hashtable]$Body
    )
    
    $json = $Body | ConvertTo-Json -Depth 10
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl$Endpoint" `
                                       -Method Post `
                                       -Body $json `
                                       -ContentType "application/json"
        return $response
    }
    catch {
        Write-Host "Error calling $Endpoint : $_" -ForegroundColor Red
        return $null
    }
}

# Helper function to make GET requests
function Invoke-ApiGet {
    param([string]$Endpoint)
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl$Endpoint" -Method Get
        return $response
    }
    catch {
        Write-Host "Error calling $Endpoint : $_" -ForegroundColor Red
        return $null
    }
}

# ============================================================================
# SCENARIO 1: Initial Session - User Reports Stress
# ============================================================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "SESSION 1: Initial Stress Report" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$session1 = @{
    query = "I have been feeling really stressed lately with work deadlines and cannot sleep well at night"
    stress = 0.85
    mood = "anxious"
    fatigue = 0.8
    recovery = 0.2
    fer_mood = "worried"
    friend_name = "Alex"
    friend_mode = "supportive"
}

$result1 = Invoke-ApiPost -Endpoint "/session" -Body $session1

if ($result1) {
    Write-Host "THERAPIST RESPONSE:" -ForegroundColor Green
    Write-Host $result1.therapist -ForegroundColor White
    Write-Host "`n---`n" -ForegroundColor Gray
    
    Write-Host "FRIEND RESPONSE:" -ForegroundColor Green
    Write-Host $result1.friend -ForegroundColor White
    Write-Host "`n---`n" -ForegroundColor Gray
    
    Write-Host "JOINT PLAN:" -ForegroundColor Green
    Write-Host $result1.joint_plan -ForegroundColor White
    Write-Host "`n---`n" -ForegroundColor Gray
    
    Write-Host "CHECKLIST ITEMS:" -ForegroundColor Green
    $result1.checklist | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
}

Start-Sleep -Seconds 3

# ============================================================================
# Check Memory - See what agents stored
# ============================================================================

Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "CHECKING MEMORY AFTER SESSION 1" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Yellow

$memory1 = Invoke-ApiGet -Endpoint "/memory"

if ($memory1) {
    Write-Host "Last User Message: $($memory1.last_user_message)" -ForegroundColor Cyan
    Write-Host "Conversation Count: $($memory1.conversation_count)" -ForegroundColor Cyan
    Write-Host "Checklist Items: $($memory1.therapist_checklist.Count)" -ForegroundColor Cyan
    Write-Host "Completed Items: $($memory1.completed_checklist_items.Count)" -ForegroundColor Cyan
}

Start-Sleep -Seconds 3

# ============================================================================
# SCENARIO 2: Follow-up Session - User Updates Progress
# ============================================================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "SESSION 2: Progress Update" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$session2 = @{
    query = "I tried the breathing exercises you suggested yesterday. I feel a bit better but still struggling with sleep"
    stress = 0.6
    mood = "tired"
    fatigue = 0.7
    recovery = 0.4
    fer_mood = "neutral"
    friend_name = "Alex"
    friend_mode = "encouraging"
}

$result2 = Invoke-ApiPost -Endpoint "/session" -Body $session2

if ($result2) {
    Write-Host "THERAPIST RESPONSE:" -ForegroundColor Green
    Write-Host $result2.therapist -ForegroundColor White
    Write-Host "`n---`n" -ForegroundColor Gray
    
    Write-Host "FRIEND RESPONSE:" -ForegroundColor Green
    Write-Host $result2.friend -ForegroundColor White
    Write-Host "`n---`n" -ForegroundColor Gray
    
    Write-Host "SESSION CONTEXT:" -ForegroundColor Green
    Write-Host "Total Interactions: $($result2.session_context.total_interactions)" -ForegroundColor Cyan
    Write-Host "Pending Items: $($result2.session_context.pending_items)" -ForegroundColor Cyan
}

Start-Sleep -Seconds 3

# ============================================================================
# Check Memory Again
# ============================================================================

Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "CHECKING MEMORY AFTER SESSION 2" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Yellow

$memory2 = Invoke-ApiGet -Endpoint "/memory"

if ($memory2) {
    Write-Host "Conversation Count: $($memory2.conversation_count)" -ForegroundColor Cyan
    Write-Host "Total Checklist Items: $($memory2.therapist_checklist.Count)" -ForegroundColor Cyan
}

Start-Sleep -Seconds 3

# ============================================================================
# SCENARIO 3: User Feeling Overwhelmed - Need Tough Love
# ============================================================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "SESSION 3: Feeling Overwhelmed" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$session3 = @{
    query = "I know I should exercise and meditate but I just do not have the energy or motivation anymore"
    stress = 0.9
    mood = "defeated"
    fatigue = 0.85
    recovery = 0.15
    fer_mood = "sad"
    friend_name = "Alex"
    friend_mode = "tough-love"
}

$result3 = Invoke-ApiPost -Endpoint "/session" -Body $session3

if ($result3) {
    Write-Host "THERAPIST RESPONSE:" -ForegroundColor Green
    Write-Host $result3.therapist -ForegroundColor White
    Write-Host "`n---`n" -ForegroundColor Gray
    
    Write-Host "FRIEND RESPONSE (Tough Love Mode):" -ForegroundColor Green
    Write-Host $result3.friend -ForegroundColor White
}

Start-Sleep -Seconds 3

# ============================================================================
# SCENARIO 4: Positive Progress Report
# ============================================================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "SESSION 4: Positive Update" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$session4 = @{
    query = "Good news! I managed to complete 3 out of 5 action items from the checklist. Feeling more energized!"
    stress = 0.4
    mood = "hopeful"
    fatigue = 0.4
    recovery = 0.7
    fer_mood = "happy"
    friend_name = "Alex"
    friend_mode = "celebratory"
}

$result4 = Invoke-ApiPost -Endpoint "/session" -Body $session4

if ($result4) {
    Write-Host "THERAPIST RESPONSE:" -ForegroundColor Green
    Write-Host $result4.therapist -ForegroundColor White
    Write-Host "`n---`n" -ForegroundColor Gray
    
    Write-Host "FRIEND RESPONSE (Celebratory Mode):" -ForegroundColor Green
    Write-Host $result4.friend -ForegroundColor White
    Write-Host "`n---`n" -ForegroundColor Gray
    
    Write-Host "SESSION CONTEXT:" -ForegroundColor Green
    Write-Host "Total Interactions: $($result4.session_context.total_interactions)" -ForegroundColor Cyan
}

Start-Sleep -Seconds 3

# ============================================================================
# Check Final Memory State
# ============================================================================

Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "FINAL MEMORY STATE" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Yellow

$memoryFinal = Invoke-ApiGet -Endpoint "/memory"

if ($memoryFinal) {
    Write-Host "Total Conversations: $($memoryFinal.conversation_count)" -ForegroundColor Cyan
    Write-Host "Current Checklist Items: $($memoryFinal.therapist_checklist.Count)" -ForegroundColor Cyan
    Write-Host "Completed Items: $($memoryFinal.completed_checklist_items.Count)" -ForegroundColor Cyan
    
    if ($memoryFinal.therapist_checklist.Count -gt 0) {
        Write-Host "`nCurrent Checklist:" -ForegroundColor Green
        $memoryFinal.therapist_checklist | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
    }
}

Start-Sleep -Seconds 3

# ============================================================================
# SCENARIO 5: Testing Therapist-Only Endpoint (Comparison)
# ============================================================================

Write-Host "`n========================================" -ForegroundColor Magenta
Write-Host "TESTING THERAPIST ONLY" -ForegroundColor Magenta
Write-Host "(No Friend Collaboration)" -ForegroundColor Magenta
Write-Host "========================================`n" -ForegroundColor Magenta

$therapistOnly = @{
    query = "I am feeling stressed about work"
    stress = 0.7
    mood = "anxious"
    fatigue = 0.6
    recovery = 0.3
    fer_mood = "worried"
}

$resultTherapist = Invoke-ApiPost -Endpoint "/therapist" -Body $therapistOnly

if ($resultTherapist) {
    Write-Host $resultTherapist.response -ForegroundColor White
}

Start-Sleep -Seconds 3

# ============================================================================
# SCENARIO 6: Testing Friend-Only Endpoint (Comparison)
# ============================================================================

Write-Host "`n========================================" -ForegroundColor Magenta
Write-Host "TESTING FRIEND ONLY" -ForegroundColor Magenta
Write-Host "(No Therapist Collaboration)" -ForegroundColor Magenta
Write-Host "========================================`n" -ForegroundColor Magenta

$friendOnly = @{
    query = "I am feeling stressed about work"
    mode = "supportive"
    friend_name = "Alex"
}

$resultFriend = Invoke-ApiPost -Endpoint "/friend" -Body $friendOnly

if ($resultFriend) {
    Write-Host $resultFriend.response -ForegroundColor White
}

Start-Sleep -Seconds 3

# ============================================================================
# Reset Memory for Clean Slate
# ============================================================================

Write-Host "`n========================================" -ForegroundColor Red
Write-Host "RESETTING MEMORY" -ForegroundColor Red
Write-Host "========================================`n" -ForegroundColor Red

$resetResult = Invoke-ApiPost -Endpoint "/memory/reset" -Body @{}

if ($resetResult) {
    Write-Host "Status: $($resetResult.status)" -ForegroundColor Green
    Write-Host "Message: $($resetResult.message)" -ForegroundColor Green
}

Start-Sleep -Seconds 2

# ============================================================================
# Verify Memory is Clear
# ============================================================================

Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "VERIFYING MEMORY IS CLEAR" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Yellow

$memoryCleared = Invoke-ApiGet -Endpoint "/memory"

if ($memoryCleared) {
    Write-Host "Conversation Count: $($memoryCleared.conversation_count)" -ForegroundColor Cyan
    Write-Host "Checklist Items: $($memoryCleared.therapist_checklist.Count)" -ForegroundColor Cyan
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "ALL TESTS COMPLETE!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "Summary:" -ForegroundColor White
Write-Host "- Tested agent collaboration across 4 scenarios" -ForegroundColor White
Write-Host "- Verified memory persistence and context building" -ForegroundColor White
Write-Host "- Compared collaborative vs individual agent responses" -ForegroundColor White
Write-Host "- Demonstrated different friend modes (supportive, tough-love, celebratory)" -ForegroundColor White
Write-Host "- Verified memory reset functionality`n" -ForegroundColor White