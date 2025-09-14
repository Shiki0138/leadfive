#!/bin/bash
# HP Infrastructure Master Test Runner
# Executes all test suites and generates comprehensive report

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
REPORT_DIR="reports"
LOG_DIR="logs"
MASTER_LOG="$LOG_DIR/master_test_run_$TIMESTAMP.log"
FINAL_REPORT="$REPORT_DIR/hp_infrastructure_test_report_$TIMESTAMP.html"

# Create directories
mkdir -p "$REPORT_DIR" "$LOG_DIR"

# Initialize master log
echo "HP Infrastructure Test Suite - Master Run" > "$MASTER_LOG"
echo "Started: $(date)" >> "$MASTER_LOG"
echo "=========================================" >> "$MASTER_LOG"

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    
    case $status in
        "INFO")
            echo -e "${BLUE}[INFO]${NC} $message"
            ;;
        "PASS")
            echo -e "${GREEN}[PASS]${NC} $message"
            ;;
        "FAIL")
            echo -e "${RED}[FAIL]${NC} $message"
            ;;
        "WARN")
            echo -e "${YELLOW}[WARN]${NC} $message"
            ;;
    esac
    
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] [$status] $message" >> "$MASTER_LOG"
}

# Function to run test suite
run_test_suite() {
    local suite_name=$1
    local test_script=$2
    local start_time=$(date +%s)
    
    print_status "INFO" "Starting $suite_name..."
    
    if [ -f "$test_script" ]; then
        chmod +x "$test_script"
        
        if $test_script >> "$MASTER_LOG" 2>&1; then
            local end_time=$(date +%s)
            local duration=$((end_time - start_time))
            print_status "PASS" "$suite_name completed in ${duration}s"
            return 0
        else
            print_status "FAIL" "$suite_name failed"
            return 1
        fi
    else
        print_status "WARN" "$suite_name script not found: $test_script"
        return 2
    fi
}

# ASCII Art Header
echo ""
echo "╔═══════════════════════════════════════════════╗"
echo "║     HP Infrastructure Test Suite v1.0         ║"
echo "║         Comprehensive Validation              ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

# System Information
print_status "INFO" "Gathering system information..."
echo "" >> "$MASTER_LOG"
echo "System Information:" >> "$MASTER_LOG"
echo "==================" >> "$MASTER_LOG"
uname -a >> "$MASTER_LOG"
echo "" >> "$MASTER_LOG"

# Test Suite Execution
print_status "INFO" "Beginning test suite execution..."
echo ""

# Track test results
declare -A TEST_RESULTS
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
SKIPPED_TESTS=0

# 1. Server Tests
echo "═══════════════════════════════════════════════"
echo "PHASE 1: SERVER INFRASTRUCTURE TESTS"
echo "═══════════════════════════════════════════════"

run_test_suite "Server Diagnostics" "test-suites/server-tests/server-diagnostics.sh"
TEST_RESULTS["server_diagnostics"]=$?
((TOTAL_TESTS++))

run_test_suite "Server Performance" "test-suites/server-tests/server-performance.sh"
TEST_RESULTS["server_performance"]=$?
((TOTAL_TESTS++))

# 2. Storage Tests
echo ""
echo "═══════════════════════════════════════════════"
echo "PHASE 2: STORAGE INFRASTRUCTURE TESTS"
echo "═══════════════════════════════════════════════"

run_test_suite "Storage Performance" "test-suites/storage-tests/storage-performance.sh"
TEST_RESULTS["storage_performance"]=$?
((TOTAL_TESTS++))

# 3. Network Tests
echo ""
echo "═══════════════════════════════════════════════"
echo "PHASE 3: NETWORK INFRASTRUCTURE TESTS"
echo "═══════════════════════════════════════════════"

run_test_suite "Network Validation" "test-suites/network-tests/network-validation.sh"
TEST_RESULTS["network_validation"]=$?
((TOTAL_TESTS++))

# 4. Management Tests
echo ""
echo "═══════════════════════════════════════════════"
echo "PHASE 4: MANAGEMENT TOOLS TESTS"
echo "═══════════════════════════════════════════════"

run_test_suite "Management Validation" "test-suites/management-tests/management-validation.sh"
TEST_RESULTS["management_validation"]=$?
((TOTAL_TESTS++))

# 5. Integration Tests
echo ""
echo "═══════════════════════════════════════════════"
echo "PHASE 5: INTEGRATION & E2E TESTS"
echo "═══════════════════════════════════════════════"

run_test_suite "Integration Testing" "test-suites/integration-tests/integration-testing.sh"
TEST_RESULTS["integration_testing"]=$?
((TOTAL_TESTS++))

# Calculate results
for test in "${!TEST_RESULTS[@]}"; do
    case ${TEST_RESULTS[$test]} in
        0) ((PASSED_TESTS++)) ;;
        1) ((FAILED_TESTS++)) ;;
        2) ((SKIPPED_TESTS++)) ;;
    esac
done

# Generate HTML Report
print_status "INFO" "Generating comprehensive test report..."

cat > "$FINAL_REPORT" << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>HP Infrastructure Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .header { background-color: #0096d6; color: white; padding: 20px; text-align: center; }
        .summary { background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .test-section { background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .pass { color: #28a745; font-weight: bold; }
        .fail { color: #dc3545; font-weight: bold; }
        .warn { color: #ffc107; font-weight: bold; }
        .info { color: #17a2b8; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8f9fa; }
        .metric { display: inline-block; margin: 10px 20px; }
        .metric-value { font-size: 2em; font-weight: bold; }
        .chart { margin: 20px 0; }
        .progress-bar { width: 100%; height: 30px; background-color: #e9ecef; border-radius: 15px; overflow: hidden; }
        .progress-fill { height: 100%; background-color: #28a745; text-align: center; line-height: 30px; color: white; }
    </style>
</head>
<body>
    <div class="header">
        <h1>HP Infrastructure Test Report</h1>
        <p>Generated: REPORT_DATE</p>
    </div>
    
    <div class="summary">
        <h2>Executive Summary</h2>
        <div class="metric">
            <div class="metric-value">TOTAL_TESTS</div>
            <div>Total Tests</div>
        </div>
        <div class="metric">
            <div class="metric-value pass">PASSED_TESTS</div>
            <div>Passed</div>
        </div>
        <div class="metric">
            <div class="metric-value fail">FAILED_TESTS</div>
            <div>Failed</div>
        </div>
        <div class="metric">
            <div class="metric-value warn">SKIPPED_TESTS</div>
            <div>Skipped</div>
        </div>
        
        <div class="chart">
            <h3>Overall Success Rate</h3>
            <div class="progress-bar">
                <div class="progress-fill" style="width: SUCCESS_RATE%;">SUCCESS_RATE%</div>
            </div>
        </div>
    </div>
    
    <div class="test-section">
        <h2>Test Suite Results</h2>
        <table>
            <tr>
                <th>Test Suite</th>
                <th>Status</th>
                <th>Details</th>
            </tr>
EOF

# Add test results to HTML
for test in "${!TEST_RESULTS[@]}"; do
    STATUS_TEXT="UNKNOWN"
    STATUS_CLASS=""
    
    case ${TEST_RESULTS[$test]} in
        0) STATUS_TEXT="PASSED"; STATUS_CLASS="pass" ;;
        1) STATUS_TEXT="FAILED"; STATUS_CLASS="fail" ;;
        2) STATUS_TEXT="SKIPPED"; STATUS_CLASS="warn" ;;
    esac
    
    TEST_NAME=$(echo "$test" | tr '_' ' ' | sed 's/\b\(.\)/\u\1/g')
    
    echo "            <tr>" >> "$FINAL_REPORT"
    echo "                <td>$TEST_NAME</td>" >> "$FINAL_REPORT"
    echo "                <td class=\"$STATUS_CLASS\">$STATUS_TEXT</td>" >> "$FINAL_REPORT"
    echo "                <td>See detailed logs for more information</td>" >> "$FINAL_REPORT"
    echo "            </tr>" >> "$FINAL_REPORT"
done

# Calculate success rate
if [ $TOTAL_TESTS -gt 0 ]; then
    SUCCESS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
else
    SUCCESS_RATE=0
fi

# Continue HTML report
cat >> "$FINAL_REPORT" << 'EOF'
        </table>
    </div>
    
    <div class="test-section">
        <h2>Infrastructure Health Score</h2>
        <table>
            <tr>
                <th>Component</th>
                <th>Score</th>
                <th>Status</th>
            </tr>
            <tr>
                <td>Server Infrastructure</td>
                <td>OVERALL_SCORE/100</td>
                <td class="SCORE_CLASS">SCORE_STATUS</td>
            </tr>
            <tr>
                <td>Storage Infrastructure</td>
                <td>OVERALL_SCORE/100</td>
                <td class="SCORE_CLASS">SCORE_STATUS</td>
            </tr>
            <tr>
                <td>Network Infrastructure</td>
                <td>OVERALL_SCORE/100</td>
                <td class="SCORE_CLASS">SCORE_STATUS</td>
            </tr>
            <tr>
                <td>Management Tools</td>
                <td>OVERALL_SCORE/100</td>
                <td class="SCORE_CLASS">SCORE_STATUS</td>
            </tr>
        </table>
    </div>
    
    <div class="test-section">
        <h2>Recommendations</h2>
        <ul>
            <li>Review failed tests and address critical issues immediately</li>
            <li>Schedule follow-up testing for skipped components</li>
            <li>Implement continuous monitoring for validated components</li>
            <li>Document any configuration changes made during testing</li>
        </ul>
    </div>
</body>
</html>
EOF

# Replace placeholders in HTML
sed -i.bak "s/REPORT_DATE/$(date)/g" "$FINAL_REPORT"
sed -i.bak "s/TOTAL_TESTS/$TOTAL_TESTS/g" "$FINAL_REPORT"
sed -i.bak "s/PASSED_TESTS/$PASSED_TESTS/g" "$FINAL_REPORT"
sed -i.bak "s/FAILED_TESTS/$FAILED_TESTS/g" "$FINAL_REPORT"
sed -i.bak "s/SKIPPED_TESTS/$SKIPPED_TESTS/g" "$FINAL_REPORT"
sed -i.bak "s/SUCCESS_RATE/$SUCCESS_RATE/g" "$FINAL_REPORT"

# Calculate overall score
OVERALL_SCORE=$((SUCCESS_RATE))
SCORE_CLASS="pass"
SCORE_STATUS="Healthy"

if [ $OVERALL_SCORE -lt 50 ]; then
    SCORE_CLASS="fail"
    SCORE_STATUS="Critical"
elif [ $OVERALL_SCORE -lt 80 ]; then
    SCORE_CLASS="warn"
    SCORE_STATUS="Needs Attention"
fi

sed -i.bak "s/OVERALL_SCORE/$OVERALL_SCORE/g" "$FINAL_REPORT"
sed -i.bak "s/SCORE_CLASS/$SCORE_CLASS/g" "$FINAL_REPORT"
sed -i.bak "s/SCORE_STATUS/$SCORE_STATUS/g" "$FINAL_REPORT"

# Remove backup files
rm -f "${FINAL_REPORT}.bak"

# Final Summary
echo ""
echo "╔═══════════════════════════════════════════════╗"
echo "║              TEST SUMMARY                     ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""
print_status "INFO" "Total Test Suites: $TOTAL_TESTS"
print_status "PASS" "Passed: $PASSED_TESTS"
print_status "FAIL" "Failed: $FAILED_TESTS"
print_status "WARN" "Skipped: $SKIPPED_TESTS"
echo ""
print_status "INFO" "Overall Success Rate: ${SUCCESS_RATE}%"
echo ""

# Store final results in memory
npx claude-flow@alpha hooks notification --message "HP infrastructure testing completed: Success Rate=${SUCCESS_RATE}%, Passed=$PASSED_TESTS, Failed=$FAILED_TESTS" --telemetry true

# Report location
echo "═══════════════════════════════════════════════"
print_status "INFO" "Test report generated: $FINAL_REPORT"
print_status "INFO" "Master log: $MASTER_LOG"
echo "═══════════════════════════════════════════════"

# Set exit code based on failures
if [ $FAILED_TESTS -gt 0 ]; then
    exit 1
else
    exit 0
fi