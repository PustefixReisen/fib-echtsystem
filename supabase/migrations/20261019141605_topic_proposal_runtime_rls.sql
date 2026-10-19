-- Internal FIB runtime may operate on editorial proposal records. Browser roles remain denied.
GRANT SELECT, INSERT, UPDATE, DELETE ON fib.process_topic_proposals TO fib_runtime;
CREATE POLICY fib_runtime_all ON fib.process_topic_proposals FOR ALL TO fib_runtime USING (true) WITH CHECK (true);
