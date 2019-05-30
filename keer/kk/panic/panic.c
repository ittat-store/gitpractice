static struct timer_list panic_timer;

static void do_panic(struct timer_list *unused)
{
    *(int*)0x42 = 'a';
}

static int so2_panic_init(void)
{
    pr_info("panic_init\n");

    timer_setup(&panic_timer,  do_panic, 0);
    mod_timer(&panic_timer, jiffies + 2 * HZ);

    return 0;
}
