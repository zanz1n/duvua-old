package logger

import (
	"fmt"
	"io"
	"log"
	"os"
)

func defaultLogger(out io.Writer, prefix ...string) *log.Logger {
	p := fmt.Sprintf("%v\t", os.Getpid())

	if len(prefix) >= 1 {
		p = prefix[0]
	}

	return log.New(
		out,
		p,
		log.Ldate|log.Ltime,
	)
}

var (
	stdOutLogger *log.Logger = defaultLogger(os.Stdout)
	stdErrLogger *log.Logger = defaultLogger(os.Stderr)

	LoggerCfg *Config
)

type Config struct {
	InfoPrefix    string
	WarningPrefix string
	ErrorPrefix   string
	HttpPrefix    string
	Colors        bool
}

func Init() {
	LoggerCfg = &Config{}

	LoggerCfg.InfoPrefix = "\tINFO\t"
	LoggerCfg.ErrorPrefix = "\tERROR\n"
	LoggerCfg.HttpPrefix = "\tHTTP\t"
	LoggerCfg.WarningPrefix = "\tWARN\t"

	if os.Getenv("TERM") == "dumb" || os.Getenv("NO_COLOR") == "1" {
		LoggerCfg.Colors = false
	} else {
		LoggerCfg.Colors = true
		LoggerCfg.InfoPrefix = "\x1b[36m" + LoggerCfg.InfoPrefix + "\x1b[0m"
		LoggerCfg.WarningPrefix = "\x1b[33m" + LoggerCfg.WarningPrefix + "\x1b[0m"
		LoggerCfg.ErrorPrefix = "\x1b[31m" + LoggerCfg.ErrorPrefix + "\x1b[0m"
		LoggerCfg.HttpPrefix = "\x1b[34m" + LoggerCfg.HttpPrefix + "\x1b[0m"
	}
}

func Info(format string, args ...any) {
	stdOutLogger.Output(2, fmt.Sprintf(LoggerCfg.InfoPrefix+format+"\n", args...))
}

func Warn(format string, args ...any) {
	stdOutLogger.Output(2, fmt.Sprintf(LoggerCfg.WarningPrefix+format+"\n", args...))
}

func Error(format string, args ...any) {
	stdErrLogger.Output(2, fmt.Sprintf(LoggerCfg.ErrorPrefix+format+"\n", args...))
}

func Http(format string, args ...any) {
	stdOutLogger.Output(2, fmt.Sprintf(LoggerCfg.HttpPrefix+format, args...))
}

func Fatal(args ...any) {
	args = append([]any{LoggerCfg.ErrorPrefix}, args...)
	stdErrLogger.Println(args...)
	os.Exit(1)
}
